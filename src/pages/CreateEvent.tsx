import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { useCreateEvent, useEvent, useUpdateEvent } from "@/hooks/useEvents";
import {
  generateSlug,
  parseEventDateParts,
  combineEventDateAndTime,
} from "@/lib/events";
import CreateEventHeader from "./create-event/components/CreateEventHeader";
import CreateEventForm from "./create-event/components/CreateEventForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventValues } from "./create-event/schema";
import { analytics } from "@/lib/analytics";
import { logger } from "@/lib/logger";

const CreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isPrefilled = useRef(false);

  const editingEventId = routerLocation.state?.eventId as string | undefined;
  const eventSlugFromState = routerLocation.state?.eventSlug as
    | string
    | undefined;
  const isEditing = Boolean(editingEventId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      location: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      linkedinUrl: "",
    },
  });

  const {
    data: existingEvent,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(isEditing ? { id: editingEventId } : undefined);

  const fromDashboard = routerLocation.state?.fromDashboard;
  const backPath = fromDashboard
    ? "/dashboard"
    : eventSlugFromState
      ? `/event/${eventSlugFromState}`
      : "/";

  useEffect(() => {
    if (eventError) {
      toast({
        variant: "destructive",
        description: TEXT.event.toast.eventNotFound,
      });
      navigate(fromDashboard ? "/dashboard" : "/");
    }
  }, [eventError, navigate, fromDashboard, toast]);

  useEffect(() => {
    if (isEditing && existingEvent && !isPrefilled.current) {
      isPrefilled.current = true;
      setValue("name", existingEvent.name ?? "");
      setValue("location", existingEvent.location ?? "");
      const { date: parsedDate, time: parsedStartTime } = parseEventDateParts(
        existingEvent.starts_at,
      );
      const { time: parsedEndTime } = parseEventDateParts(
        existingEvent.ends_at,
      );
      setValue("eventDate", parsedDate);
      setValue("startTime", parsedStartTime);
      setValue("endTime", parsedEndTime);
      setValue("linkedinUrl", existingEvent.linkedin_event_url ?? "");
    }
  }, [isEditing, existingEvent, setValue]);

  const onSubmit = async (values: CreateEventValues) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          variant: "destructive",
          description: TEXT.createEvent.toast.authRequired,
        });
        navigate("/auth");
        return;
      }

      const normalizedStartsAt = combineEventDateAndTime(
        values.eventDate,
        values.startTime,
      );
      const normalizedEndsAt = combineEventDateAndTime(
        values.eventDate,
        values.endTime,
      );

      if (!normalizedStartsAt || !normalizedEndsAt) {
        toast({
          variant: "destructive",
          description: TEXT.createEvent.toast.missingDateTime,
        });
        return;
      }

      if (isEditing && editingEventId) {
        const updatedEvent = await updateEvent.mutateAsync({
          eventId: editingEventId,
          payload: {
            name: values.name,
            location: values.location || null,
            starts_at: normalizedStartsAt,
            ends_at: normalizedEndsAt,
            linkedin_event_url: values.linkedinUrl || null,
          },
        });

        analytics.track("event_updated", { eventId: updatedEvent.id });

        toast({
          description: TEXT.event.toast.updateSuccess,
        });
        navigate(`/event/${updatedEvent.slug}`);
      } else {
        const slug = generateSlug(values.name);

        const _newEvent = await createEvent.mutateAsync({
          name: values.name,
          slug,
          location: values.location || null,
          starts_at: normalizedStartsAt,
          ends_at: normalizedEndsAt,
          linkedin_event_url: values.linkedinUrl || null,
          organizer_id: session.user.id,
        });

        analytics.track("event_created", { slug });

        toast({
          description: TEXT.createEvent.toast.success,
        });
        navigate(`/event-success/${slug}`);
      }
    } catch (error: unknown) {
      logger.error(error, { category: "Events" });
      const message =
        error instanceof Error ? error.message : TEXT.createEvent.toast.failure;
      toast({
        variant: "destructive",
        description: message,
      });
    }
  };

  if (isEditing && isEventLoading) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4" />
          <p className="text-text-secondary">{TEXT.event.page.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col">
      <CreateEventHeader backPath={backPath} />

      <div className="flex-1 overflow-y-auto flex justify-center px-6 py-12">
        <div className="w-full max-w-[640px]">
          <div className="text-[11px] font-mono text-text-secondary tracking-[1px]">
            {isEditing ? "EDIT EVENT" : "CREATE EVENT · STEP 1 OF 2"}
          </div>
          <h1 className="text-[32px] font-semibold tracking-[-0.8px] mt-2">
            Set the details.
          </h1>
          <p className="text-sm text-text-secondary mt-2 max-w-[420px]">
            Name it, pick the time, drop the address. You can adjust anything up
            until the event starts.
          </p>

          <div className="mt-8">
            <CreateEventForm
              control={control}
              errors={errors}
              isSubmitting={isSubmitting || (isEditing && isEventLoading)}
              mode={isEditing ? "edit" : "create"}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={() => navigate(backPath)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
