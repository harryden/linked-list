import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";
import { useCreateEvent, useEvent, useUpdateEvent } from "@/hooks/useEvents";
import {
  generateSlug,
  parseEventDateParts,
  combineEventDateAndTime,
} from "@/lib/events";
import CreateEventHeader from "./create-event/components/CreateEventHeader";
import CreateEventForm from "./create-event/components/CreateEventForm";
import PageContainer from "@/components/layout/PageContainer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventValues } from "./create-event/schema";
import { logger } from "@/lib/logger";

const CreateEvent = () => {
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
    register,
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
        toast.error(TEXT.createEvent.toast.authRequired);
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
        toast.error(TEXT.createEvent.toast.missingDateTime);
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

        toast.success(TEXT.event.toast.updateSuccess);
        navigate(`/event/${updatedEvent.slug}`);
      } else {
        const slug = generateSlug(values.name);

        await createEvent.mutateAsync({
          name: values.name,
          slug,
          location: values.location || null,
          starts_at: normalizedStartsAt,
          ends_at: normalizedEndsAt,
          linkedin_event_url: values.linkedinUrl || null,
          organizer_id: session.user.id,
        });

        toast.success(TEXT.createEvent.toast.success);
        navigate(`/event-success/${slug}`);
      }
    } catch (error: unknown) {
      logger.error(error, { category: "Events" });
      const message =
        error instanceof Error ? error.message : TEXT.createEvent.toast.failure;
      toast.error(message);
    }
  };

  if (isEditing && isEventLoading) {
    return (
      <PageContainer className="items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{TEXT.event.page.loading}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md" className="pt-0 pb-8">
      <CreateEventHeader backPath={backPath} backText={backText} />

      <div className="mt-8">
        <CreateEventForm
          register={register}
          control={control}
          errors={errors}
          isSubmitting={isSubmitting || (isEditing && isEventLoading)}
          mode={isEditing ? "edit" : "create"}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    </PageContainer>
  );
};

export default CreateEvent;
