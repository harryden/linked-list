import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  QrCode,
  Share2,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import AttendButton from "@/pages/event/components/AttendButton";
import AttendeeList from "@/pages/event/components/AttendeeList";
import EventLoading from "@/pages/event/components/EventLoading";
import EventNotFound from "@/pages/event/components/EventNotFound";
import EventUnauthorized from "@/pages/event/components/EventUnauthorized";
import EventDeleteDialog from "@/pages/event/components/EventDeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent, useDeleteEvent } from "@/hooks/useEvents";
import {
  useAttendances,
  useJoinEvent,
  useRealtimeAttendances,
} from "@/hooks/useAttendances";
import { useMyProfile } from "@/hooks/useProfile";
import { TEXT } from "@/constants/text";
import { eventCodeFromId } from "@/lib/events";
import { analytics } from "@/lib/analytics";
import { exportAttendeesToCSV } from "@/lib/export";

const useSession = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setCurrentUserId(session?.user?.id ?? null);
        }
      } catch (_error) {
        logger.error(_error, { category: "Events" });
      } finally {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    };

    void loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return { currentUserId, isSessionLoading };
};

const getTimeZoneAbbreviation = (date: Date | null) => {
  if (!date) return null;
  const part = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Stockholm",
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  if (!part) return null;
  if (part.includes("GMT+2") || part.includes("GMT+02")) return "CEST";
  if (part.includes("GMT+1") || part.includes("GMT+01")) return "CET";
  return part;
};

const EventPage = () => {
  const { toast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserId, isSessionLoading } = useSession();
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const isDeleting = useRef(false);
  const attendeeListRef = useRef<HTMLDivElement>(null);

  const eventIdentifier = slug ? { slug } : undefined;
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(eventIdentifier);

  useRealtimeAttendances(event?.id);

  useEffect(() => {
    if (eventError && !isDeleting.current) {
      toast({
        variant: "destructive",
        description: TEXT.event.toast.loadFailure,
      });
    }
  }, [eventError, toast]);

  const { data: organizerProfile } = useMyProfile(event?.organizer_id);

  const { data: userAttendance, isLoading: isUserAttendanceLoading } =
    useAttendances({
      eventId: event?.id,
      userId: currentUserId ?? undefined,
      enabled: Boolean(event?.id && currentUserId),
    });

  const isOrganizer = Boolean(
    currentUserId && event && currentUserId === event.organizer_id,
  );

  const isAttending = (userAttendance?.length ?? 0) > 0;

  const canViewAttendees = Boolean(event && (isOrganizer || isAttending));

  const { data: attendeeRecords, isLoading: isAttendeesLoading } =
    useAttendances({
      eventId: event?.id,
      includeProfiles: true,
      enabled: canViewAttendees,
    });

  const eventCode = useMemo(() => {
    if (!event?.id) return "";
    return eventCodeFromId(event.id);
  }, [event?.id]);

  const isLoading =
    isSessionLoading || isEventLoading || isUserAttendanceLoading;

  useEffect(() => {
    if (justJoined && !isAttendeesLoading) {
      attendeeListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [justJoined, isAttendeesLoading]);

  const eventStartDate = useMemo(() => {
    if (!event?.starts_at) return null;
    const d = new Date(event.starts_at);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [event?.starts_at]);

  const eventEndDate = useMemo(() => {
    if (!event?.ends_at) return null;
    const d = new Date(event.ends_at);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [event?.ends_at]);

  const dateReference = eventStartDate ?? eventEndDate;

  const formattedEventDate = useMemo(() => {
    if (!dateReference) return TEXT.common.labels.dateNotSet;
    return dateReference.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [dateReference]);

  const timeZoneAbbreviation = useMemo(
    () => getTimeZoneAbbreviation(eventStartDate ?? eventEndDate),
    [eventStartDate, eventEndDate],
  );

  const formattedTimeRange = useMemo(() => {
    if (!eventStartDate && !eventEndDate) return TEXT.common.labels.timeNotSet;
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Stockholm",
    });
    const start = eventStartDate ? fmt.format(eventStartDate) : null;
    const end = eventEndDate ? fmt.format(eventEndDate) : null;
    const zone = timeZoneAbbreviation ? ` ${timeZoneAbbreviation}` : "";
    if (start && end) return `${start} — ${end}${zone}`;
    return start
      ? `${start}${zone}`
      : end
        ? `${end}${zone}`
        : TEXT.common.labels.timeNotSet;
  }, [eventStartDate, eventEndDate, timeZoneAbbreviation]);

  const joinEvent = useJoinEvent();
  const deleteEvent = useDeleteEvent();

  const handleCheckIn = async () => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    if (!event?.id) {
      toast({
        variant: "destructive",
        description: TEXT.event.toast.eventNotFound,
      });
      return;
    }

    try {
      await joinEvent.mutateAsync({
        eventId: event.id,
        userId: currentUserId,
        source: "manual",
      });

      analytics.track("event_joined", { eventId: event.id, source: "manual" });

      toast({
        description: TEXT.event.toast.checkInSuccess,
      });
      setJustJoined(true);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505"
      ) {
        toast({ description: TEXT.event.toast.alreadyCheckedIn });
        return;
      }
      toast({
        variant: "destructive",
        description: TEXT.event.toast.checkInFailure,
      });
    }
  };

  const handleEditEvent = () => {
    if (!event) return;
    navigate("/create-event", {
      state: { eventId: event.id, eventSlug: event.slug },
    });
  };

  const handleDeleteEvent = async () => {
    if (!event) return;
    try {
      isDeleting.current = true;
      await deleteEvent.mutateAsync({
        eventId: event.id,
        organizerId: event.organizer_id ?? undefined,
        eventSlug: event.slug,
      });
      analytics.track("event_deleted", { slug: event.slug });
      toast({ description: TEXT.event.toast.deleteSuccess });
      navigate("/dashboard");
    } catch (error) {
      isDeleting.current = false;
      logger.error(error, { category: "Events" });
      toast({
        variant: "destructive",
        description: TEXT.event.toast.deleteFailure,
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleExport = () => {
    if (!event || !attendeeRecords) return;
    try {
      exportAttendeesToCSV(event.name, attendeeRecords);
      toast({
        title: "Success",
        description: TEXT.event.toast.exportSuccess,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: TEXT.event.toast.exportFailure,
      });
    }
  };

  if (isLoading) return <EventLoading />;
  if (!event) return <EventNotFound />;

  if (!currentUserId || !canViewAttendees) {
    return (
      <EventUnauthorized
        event={event}
        eventCode={eventCode}
        organizer={organizerProfile}
        currentUserId={currentUserId}
        isOrganizer={isOrganizer}
        isAttending={isAttending}
        onCheckIn={handleCheckIn}
        isLoading={joinEvent.isPending}
        onEdit={isOrganizer ? handleEditEvent : undefined}
        onDelete={isOrganizer ? () => setShowDeleteDialog(true) : undefined}
        redirectPath={`${location.pathname}${location.search}`}
      />
    );
  }

  const organizerInitials = organizerProfile?.name
    ? organizerProfile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="flex items-center px-4 pt-3 pb-4 gap-3">
        <Link to={currentUserId ? "/dashboard" : "/"}>
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-0"
            aria-label={TEXT.common.links.backToDashboard}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
        <div className="flex-1 text-[12px] font-mono text-text-secondary tracking-[0.5px] uppercase truncate">
          EVENT · {event.slug?.toUpperCase()}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-0"
            aria-label="Share"
            onClick={() => {
              const shareData = {
                title: event.name,
                url: window.location.href,
              };
              if (navigator.share) {
                void navigator.share(shareData).catch(() => undefined);
              } else {
                void navigator.clipboard.writeText(window.location.href);
                toast({
                  description: "Link copied to clipboard",
                });
              }
            }}
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>

          {isOrganizer && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-9 h-9 p-0"
                  aria-label={TEXT.event.header.options}
                >
                  <MoreVertical className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onSelect={() => setShowQRDialog(true)}>
                  <QrCode className="mr-2 h-4 w-4" aria-hidden="true" />
                  {TEXT.common.buttons.viewQrCode}
                </DropdownMenuItem>
                {(attendeeRecords?.length ?? 0) > 0 && (
                  <DropdownMenuItem onSelect={handleExport}>
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    {TEXT.event.attendeeList.exportCsv}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    navigate("/create-event", {
                      state: {
                        eventId: event.id,
                        eventSlug: event.slug,
                        fromDashboard: false,
                      },
                    })
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                  {TEXT.event.header.edit}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteDialog(true)}
                  className="text-state-error focus:text-state-error focus:bg-state-error-bg"
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  {TEXT.event.header.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {organizerProfile && (
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-6 h-6 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[9px] font-medium text-text-secondary flex-shrink-0">
              {organizerInitials}
            </div>
            <span className="text-[13px] text-text-secondary">
              Hosted by {organizerProfile.name}
            </span>
          </div>
        )}

        <h1 className="text-[28px] font-semibold tracking-[-0.6px] leading-[1.1] mb-5">
          {event.name}
        </h1>

        <div className="flex flex-col gap-2.5 mb-6">
          {dateReference && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13px] font-medium">
                  {formattedEventDate}
                </div>
                <div className="text-[12px] text-text-secondary font-mono">
                  {formattedTimeRange}
                </div>
              </div>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13px] font-medium">{event.location}</div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          {justJoined && (
            <div className="mb-6 p-4 bg-state-success-bg border border-state-success rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex-1">
                <div className="text-sm font-semibold text-state-success">
                  {TEXT.event.page.checkInSuccessBanner}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-state-success hover:bg-state-success/10"
                onClick={() => setJustJoined(false)}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <AttendButton
            currentUserId={currentUserId}
            isOrganizer={isOrganizer}
            isAttending={isAttending}
            checkedInAt={userAttendance?.[0]?.created_at ?? null}
            onCheckIn={handleCheckIn}
            isLoading={joinEvent.isPending}
            redirectPath={`${location.pathname}${location.search}`}
          />
        </div>

        <div ref={attendeeListRef}>
          <AttendeeList
            attendees={attendeeRecords ?? []}
            currentUserId={currentUserId}
            isOrganizer={isOrganizer}
            isLoading={isAttendeesLoading}
            eventName={event.name}
            startsAt={event.starts_at}
            endsAt={event.ends_at}
          />
        </div>
      </div>

      <QRCodeDialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        eventSlug={event.slug}
        eventName={event.name}
        eventCode={eventCode}
      />

      <EventDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteEvent}
        isDeleting={deleteEvent.isPending}
      />
    </div>
  );
};

export default EventPage;
