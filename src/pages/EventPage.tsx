import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import EventHeader from "@/pages/event/components/EventHeader";
import AttendButton from "@/pages/event/components/AttendButton";
import AttendeeList from "@/pages/event/components/AttendeeList";
import {
  useAttendances,
  useEvent,
  useJoinEvent,
  useMyProfile,
  type ProfileRow,
  useDeleteEvent,
} from "@/hooks/useSupabaseData";
import { TEXT } from "@/constants/text";
import linkbackLogo from "@/assets/linkback-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EventPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setCurrentUserId(session?.user?.id ?? null);
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

  const eventIdentifier = slug ? { slug } : undefined;
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(eventIdentifier);

  useEffect(() => {
    if (eventError) {
      console.error("Error loading event:", eventError);
      toast.error(TEXT.event.toast.loadFailure);
    }
  }, [eventError]);

  const { data: organizerProfile } = useMyProfile(event?.organizer_id);

  const {
    data: userAttendance,
    isLoading: isUserAttendanceLoading,
  } = useAttendances({
    eventId: event?.id,
    userId: currentUserId ?? undefined,
    enabled: Boolean(event?.id && currentUserId),
  });

  const isOrganizer = Boolean(
    currentUserId && event && currentUserId === event.organizer_id,
  );

  const isAttending = (userAttendance?.length ?? 0) > 0;

  const canViewAttendees = Boolean(event && (isOrganizer || isAttending));

  const { data: attendeeRecords, isLoading: isAttendeesLoading } = useAttendances({
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
    if (!event?.id) {
      return "";
    }

    return Math.abs(
      parseInt(event.id.replace(/-/g, "").substring(0, 8), 16) % 1000000,
    )
      .toString()
      .padStart(6, "0");
  }, [event?.id]);

  const isLoading = isSessionLoading || isEventLoading || isUserAttendanceLoading;

  const joinEvent = useJoinEvent();
  const deleteEvent = useDeleteEvent();

  const handleCheckIn = async () => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    if (!event?.id) {
      toast.error(TEXT.event.toast.eventNotFound);
      return;
    }

    try {
      await joinEvent.mutateAsync({
        eventId: event.id,
        userId: currentUserId,
        source: "manual",
      });

      toast.success(TEXT.event.toast.checkInSuccess);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505"
      ) {
        toast.info(TEXT.event.toast.alreadyCheckedIn);
        return;
      }

      console.error("Failed to check in:", error);
      toast.error(TEXT.event.toast.checkInFailure);
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
      toast.success(TEXT.event.toast.deleteSuccess);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error(TEXT.event.toast.deleteFailure);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{TEXT.event.page.loading}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{TEXT.event.page.notFoundTitle}</CardTitle>
            <CardDescription>{TEXT.event.page.notFoundDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">{TEXT.event.page.homeButton}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUserId || !canViewAttendees) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-8 pb-6 px-6 space-y-6">
            <EventHeader
              event={event}
              eventCode={eventCode}
              organizer={organizerProfile}
              currentUserId={currentUserId}
              isOrganizer={isOrganizer}
              isAttending={isAttending}
              variant="compact"
              onEdit={isOrganizer ? handleEditEvent : undefined}
              onDelete={isOrganizer ? () => setShowDeleteDialog(true) : undefined}
            />

            <div className="space-y-4">
              <AttendButton
                currentUserId={currentUserId}
                isOrganizer={isOrganizer}
                isAttending={isAttending}
                onCheckIn={handleCheckIn}
                isLoading={joinEvent.isPending}
                mode="linkedin"
              />
              <p className="text-xs text-center text-muted-foreground px-4">
                {TEXT.event.page.guestNotice}
              </p>
            </div>

            {currentUserId && (
              <div className="text-center pt-2">
                <Link
                  to="/dashboard"
                  className="text-sm text-primary hover:underline"
                >
                  {TEXT.common.links.viewPastEvents}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
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
              onDelete={isOrganizer ? () => setShowDeleteDialog(true) : undefined}
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
              />
            </CardContent>
          </Card>

          <AttendeeList
            attendees={attendees}
            currentUserId={currentUserId}
            isOrganizer={isOrganizer}
            isLoading={isAttendeesLoading}
          />
        </div>
      </main>

      <QRCodeDialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        eventSlug={event.slug}
        eventName={event.name}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {TEXT.event.header.deleteConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {TEXT.event.header.deleteConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending}>
              {TEXT.event.header.deleteConfirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={deleteEvent.isPending}
            >
              {TEXT.event.header.deleteConfirmSubmit}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventPage;
