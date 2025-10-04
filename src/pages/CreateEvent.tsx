import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";
import { useCreateEvent, useEvent, useUpdateEvent } from "@/hooks/useSupabaseData";
import CreateEventHeader from "./create-event/components/CreateEventHeader";
import CreateEventForm from "./create-event/components/CreateEventForm";

const toDateTimeLocalValue = (input?: string | null) => {
  if (!input) {
    return "";
  }

  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const tzAdjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return tzAdjusted.toISOString().slice(0, 16);
};

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const editingEventId = routerLocation.state?.eventId as string | undefined;
  const eventSlugFromState = routerLocation.state?.eventSlug as string | undefined;
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
      setStartsAt(toDateTimeLocalValue(existingEvent.starts_at));
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

      const normalizedStartsAt = startsAt
        ? new Date(startsAt).toISOString()
        : null;

      if (isEditing && editingEventId) {
        try {
          const updatedEvent = await updateEvent.mutateAsync({
            eventId: editingEventId,
            payload: {
              name,
              location: eventLocation || null,
              starts_at: normalizedStartsAt,
              linkedin_event_url: linkedinUrl || null,
            },
          });

          toast.success(TEXT.event.toast.updateSuccess);
          navigate(`/event/${updatedEvent.slug}`);
        } catch (error: any) {
          toast.error(error.message || TEXT.event.toast.updateFailure);
        }
      } else {
        const slug = generateSlug(name);

        await createEvent.mutateAsync({
          name,
          slug,
          location: eventLocation || null,
          starts_at: normalizedStartsAt,
          linkedin_event_url: linkedinUrl || null,
          organizer_id: session.user.id,
        });

        toast.success(TEXT.createEvent.toast.success);
        navigate(`/event-success/${slug}`);
      }
    } catch (error: any) {
      toast.error(error.message || TEXT.createEvent.toast.failure);
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
            startsAt={startsAt}
            linkedinUrl={linkedinUrl}
            isSubmitting={isLoading || (isEditing && isEventLoading)}
            mode={isEditing ? "edit" : "create"}
            onNameChange={setName}
            onLocationChange={setEventLocation}
            onStartsAtChange={setStartsAt}
            onLinkedinUrlChange={setLinkedinUrl}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
