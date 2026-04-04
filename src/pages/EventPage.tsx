import { useEffect, useMemo, useRef, useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useLocation,
  NavigateFunction,
} from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import EventHeader from "@/pages/event/components/EventHeader";
import AttendButton from "@/pages/event/components/AttendButton";
import AttendeeList from "@/pages/event/components/AttendeeList";
import EventLoading from "@/pages/event/components/EventLoading";
import EventNotFound from "@/pages/event/components/EventNotFound";
import EventUnauthorized from "@/pages/event/components/EventUnauthorized";
import EventDeleteDialog from "@/pages/event/components/EventDeleteDialog";
import CheckInSuccess from "@/pages/event/components/CheckInSuccess";
import { useEvent, useDeleteEvent } from "@/hooks/useEvents";
import {
  useAttendances,
  useJoinEvent,
  useRealtimeAttendances,
} from "@/hooks/useAttendances";
import { useMyProfile, type ProfileRow } from "@/hooks/useProfile";
import { TEXT } from "@/constants/text";
import { eventCodeFromId } from "@/lib/events";
import linkbackLogo from "@/assets/linkback-logo.png";
import PageContainer from "@/components/layout/PageContainer";

const useSession = (navigate: NavigateFunction) => {
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
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    };

    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return { currentUserId, isSessionLoading };
};

const EventPage = () => {
  const { toast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserId, isSessionLoading } = useSession(navigate);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const attendeeListRef = useRef<HTMLDivElement>(null);

  const eventIdentifier = slug ? { slug } : undefined;
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(eventIdentifier);

  useRealtimeAttendances(event?.id);

  useEffect(() => {
    if (eventError) {
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

  const attendees = useMemo(() => {
    return (attendeeRecords ?? [])
      .map((record) => record.profiles)
      .filter(Boolean) as ProfileRow[];
  }, [attendeeRecords]);

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
        toast({
          description: TEXT.event.toast.alreadyCheckedIn,
        });
        return;
      }

      toast({
        variant: "destructive",
        description: TEXT.event.toast.checkInFailure,
      });
    }
  };

  const handleEditEvent = () => {
    if (!event) {
      return;
    }

    navigate("/create-event", {
      state: {
        eventId: event.id,
        eventSlug: event.slug,
      },
    });
  };

  const handleDeleteEvent = async () => {
    if (!event) {
      return;
    }

    try {
      await deleteEvent.mutateAsync({
        eventId: event.id,
        organizerId: event.organizer_id ?? undefined,
        eventSlug: event.slug,
      });
      toast({
        description: TEXT.event.toast.deleteSuccess,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        description: TEXT.event.toast.deleteFailure,
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return <EventLoading />;
  }

  if (!event) {
    return <EventNotFound />;
  }

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

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={currentUserId ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <img src={linkbackLogo} alt="LinkBack" className="h-20 w-auto" />
          </Link>
          {!currentUserId && (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full">
                {TEXT.common.buttons.signIn}
              </Button>
            </Link>
          )}
        </div>
      </header>

      <PageContainer withGradient={false} className="py-8">
        <div className="space-y-8">
          {currentUserId && (
            <Link to="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {TEXT.common.links.backToDashboard}
              </Button>
            </Link>
          )}

          <Card className="shadow-xl">
            <CardHeader className="space-y-4">
              <EventHeader
                event={event}
                eventCode={eventCode}
                organizer={organizerProfile}
                currentUserId={currentUserId}
                isOrganizer={isOrganizer}
                isAttending={isAttending}
                onEdit={isOrganizer ? handleEditEvent : undefined}
                onDelete={
                  isOrganizer ? () => setShowDeleteDialog(true) : undefined
                }
                onShowQr={() => setShowQRDialog(true)}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <AttendButton
                currentUserId={currentUserId}
                isOrganizer={isOrganizer}
                isAttending={isAttending}
                onCheckIn={handleCheckIn}
                isLoading={joinEvent.isPending}
                mode="primary"
                redirectPath={`${location.pathname}${location.search}`}
              />
            </CardContent>
          </Card>

          <div ref={attendeeListRef}>
            {justJoined && <CheckInSuccess onDismiss={() => setJustJoined(false)} />}
            <AttendeeList
              attendees={attendees}
              currentUserId={currentUserId}
              isOrganizer={isOrganizer}
              isLoading={isAttendeesLoading}
            />
          </div>
        </div>
      </PageContainer>

      <QRCodeDialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        eventSlug={event.slug}
        eventName={event.name}
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
