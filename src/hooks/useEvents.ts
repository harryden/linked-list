import { useMemo } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type EventRow = Database["public"]["Tables"]["events"]["Row"];

export type EventIdentifier = {
  id?: string;
  slug?: string;
};

export const normalizeEventIdentifier = (identifier?: EventIdentifier) => ({
  id: identifier?.id ?? undefined,
  slug: identifier?.slug ?? undefined,
});

export const ensureEventIdentifier = (identifier: EventIdentifier) => {
  if (!identifier.id && !identifier.slug) {
    throw new Error("An event id or slug is required");
  }
};

export const eventQueryKey = (identifier: EventIdentifier) => [
  "event",
  identifier,
];

export const fetchEvent = async (
  identifier: EventIdentifier,
): Promise<EventRow> => {
  ensureEventIdentifier(identifier);

  let query = supabase.from("events").select("*");

  if (identifier.id) {
    query = query.eq("id", identifier.id);
  }

  if (identifier.slug) {
    query = query.eq("slug", identifier.slug);
  }

  const { data, error } = await query.single();

  if (error) {
    throw error;
  }

  return data;
};

export const useEvent = (identifier?: EventIdentifier) => {
  const normalized = useMemo(
    () => normalizeEventIdentifier(identifier),
    [identifier],
  );
  const enabled = Boolean(normalized.id || normalized.slug);

  return useQuery({
    queryKey: eventQueryKey(normalized),
    enabled,
    queryFn: () => fetchEvent(normalized),
  });
};

export type UseEventsOptions = {
  organizerId?: string;
  shortCode?: string;
  enabled?: boolean;
};

export const normalizeEventsOptions = (options?: UseEventsOptions) => ({
  organizerId: options?.organizerId ?? undefined,
  shortCode: options?.shortCode ?? undefined,
});

export const eventsQueryKey = (options?: UseEventsOptions) => [
  "events",
  normalizeEventsOptions(options),
];

export const fetchEvents = async (
  options?: UseEventsOptions,
): Promise<EventRow[]> => {
  const normalized = normalizeEventsOptions(options);
  let query = supabase.from("events").select("*");

  if (normalized.organizerId) {
    query = query.eq("organizer_id", normalized.organizerId);
  }

  if (normalized.shortCode) {
    query = query.eq("short_code", normalized.shortCode);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const useMyEvents = (
  userId?: string,
  options?: { enabled?: boolean },
) => {
  const enabled = options?.enabled ?? Boolean(userId);

  return useQuery({
    queryKey: ["my-events", userId],
    enabled,
    queryFn: () => {
      if (!userId) {
        throw new Error("User id required to fetch organizer events");
      }

      return fetchEvents({ organizerId: userId });
    },
  });
};

type CreateEventVariables = Database["public"]["Tables"]["events"]["Insert"];

type UpdateEventVariables = {
  eventId: string;
  payload: Database["public"]["Tables"]["events"]["Update"];
};

type DeleteEventVariables = {
  eventId: string;
  organizerId?: string;
  eventSlug?: string;
};

type DeletedEventRecord = {
  id: string;
  slug: string;
  organizer_id: string;
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEventVariables) => {
      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned");
      }

      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      if (variables.organizer_id) {
        queryClient.invalidateQueries({
          queryKey: ["my-events", variables.organizer_id],
        });
      }
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, payload }: UpdateEventVariables) => {
      const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", eventId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned");
      }

      return data;
    },
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      if (updatedEvent.id) {
        queryClient.invalidateQueries({
          queryKey: eventQueryKey({ id: updatedEvent.id }),
        });
      }
      if (updatedEvent.organizer_id) {
        queryClient.invalidateQueries({
          queryKey: ["my-events", updatedEvent.organizer_id],
        });
      }
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId }: DeleteEventVariables) => {
      const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .select("id, slug, organizer_id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      return (data ?? null) as DeletedEventRecord | null;
    },
    onSuccess: (deletedEvent, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({
        queryKey: eventQueryKey({ id: variables.eventId }),
      });
      const slugToInvalidate = deletedEvent?.slug ?? variables.eventSlug;
      const organizerId =
        deletedEvent?.organizer_id ?? variables.organizerId ?? undefined;

      if (slugToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: eventQueryKey({ slug: slugToInvalidate }),
        });
      }

      if (organizerId) {
        queryClient.invalidateQueries({
          queryKey: ["my-events", organizerId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};

export const fetchEventWithClient = (
  queryClient: QueryClient,
  identifier: EventIdentifier,
) =>
  queryClient.fetchQuery({
    queryKey: eventQueryKey(identifier),
    queryFn: () => fetchEvent(identifier),
  });

export const fetchEventsWithClient = (
  queryClient: QueryClient,
  options?: UseEventsOptions,
) =>
  queryClient.fetchQuery({
    queryKey: eventsQueryKey(options),
    queryFn: () => fetchEvents(options),
  });
