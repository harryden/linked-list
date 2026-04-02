import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";
import {
  useCreateEvent,
  useEvent,
  useUpdateEvent,
} from "@/hooks/useEvents";
import CreateEventHeader from "./create-event/components/CreateEventHeader";
import CreateEventForm from "./create-event/components/CreateEventForm";

const parseDateParts = (input?: string | null) => {
  if (!input) {
    return { date: "", time: "" };
  }

  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const tzAdjusted = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );

  return {
    date: tzAdjusted.toISOString().slice(0, 10),
    time: tzAdjusted.toISOString().slice(11, 16),
  };
};

const combineDateAndTime = (date: string, time: string) => {
  if (!date || !time) {
    return null;
  }

  const combined = new Date(`${date}T${time}`);

  if (Number.isNaN(combined.getTime())) {
    return null;
  }

  return combined.toISOString();
};

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const editingEventId = routerLocation.state?.eventId as string | undefined;
  const eventSlugFromState = routerLocation.state?.eventSlug as
    | string
    | undefined;
  const isEditing = Boolean(editingEventId);

  const {
    data: existingEvent,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(isEditing ? { id: editingEventId } : undefined);

  // Check if coming from dashboard, default to home
  const fromDashboard = routerLocation.state?.fromDashboard;
  const backPath = fromDashboard
    ? "/dashboard"
    : eventSlugFromState
      ? `/event/${eventSlugFromState}`
      : "/";
  const backText = fromDashboard
    ? TEXT.createEvent.header.backToDashboard
    : eventSlugFromState
      ? TEXT.createEvent.header.backToEvent
      : TEXT.createEvent.header.backToHome;

  useEffect(() => {
    if (eventError) {
      toast.error(TEXT.event.toast.eventNotFound);
      navigate(fromDashboard ? "/dashboard" : "/");
    }
  }, [eventError, navigate, fromDashboard]);

  useEffect(() => {
    if (isEditing && existingEvent && !isPrefilled) {
      setName(existingEvent.name ?? "");
      setEventLocation(existingEvent.location ?? "");
      const { date: parsedDate, time: parsedStartTime } = parseDateParts(
        existingEvent.starts_at,
      );
      const { time: parsedEndTime } = parseDateParts(existingEvent.ends_at);
      setEventDate(parsedDate);
      setStartTime(parsedStartTime);
      setEndTime(parsedEndTime);
      setLinkedinUrl(existingEvent.linkedin_event_url ?? "");
      setIsPrefilled(true);
    }
  }, [isEditing, existingEvent, isPrefilled]);

  const generateSlug = (name: string) => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error(TEXT.createEvent.toast.authRequired);
        navigate("/auth");
        return;
      }

      const normalizedStartsAt = combineDateAndTime(eventDate, startTime);
      const normalizedEndsAt = combineDateAndTime(eventDate, endTime);

      if (!eventDate) {
        toast.error(TEXT.createEvent.toast.missingDateTime);
        setIsLoading(false);
        return;
      }

      if (!normalizedStartsAt) {
        toast.error(TEXT.createEvent.toast.missingDateTime);
        setIsLoading(false);
        return;
      }

      if (!normalizedEndsAt) {
        toast.error(TEXT.createEvent.toast.missingEndTime);
        setIsLoading(false);
        return;
      }

      if (
        normalizedStartsAt &&
        normalizedEndsAt &&
        new Date(normalizedEndsAt).getTime() <=
          new Date(normalizedStartsAt).getTime()
      ) {
        toast.error(TEXT.createEvent.toast.invalidTimeRange);
        setIsLoading(false);
        return;
      }

      if (isEditing && editingEventId) {
        try {
          const updatedEvent = await updateEvent.mutateAsync({
            eventId: editingEventId,
            payload: {
              name,
              location: eventLocation || null,
              starts_at: normalizedStartsAt,
              ends_at: normalizedEndsAt,
              linkedin_event_url: linkedinUrl || null,
            },
          });

          toast.success(TEXT.event.toast.updateSuccess);
          navigate(`/event/${updatedEvent.slug}`);
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : TEXT.event.toast.updateFailure;
          toast.error(message);
        }
      } else {
        const slug = generateSlug(name);

        await createEvent.mutateAsync({
          name,
          slug,
          location: eventLocation || null,
          starts_at: normalizedStartsAt,
          ends_at: normalizedEndsAt,
          linkedin_event_url: linkedinUrl || null,
          organizer_id: session.user.id,
        });

        toast.success(TEXT.createEvent.toast.success);
        navigate(`/event-success/${slug}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : TEXT.createEvent.toast.failure;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing && isEventLoading && !isPrefilled) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{TEXT.event.page.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <CreateEventHeader backPath={backPath} backText={backText} />

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <CreateEventForm
            name={name}
            location={eventLocation}
            eventDate={eventDate}
            startTime={startTime}
            endTime={endTime}
            linkedinUrl={linkedinUrl}
            isSubmitting={isLoading || (isEditing && isEventLoading)}
            mode={isEditing ? "edit" : "create"}
            onNameChange={setName}
            onLocationChange={setEventLocation}
            onEventDateChange={setEventDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onLinkedinUrlChange={setLinkedinUrl}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
