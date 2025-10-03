import { useMemo } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AttendanceRow = Database["public"]["Tables"]["attendances"]["Row"];

type EventIdentifier = {
  id?: string;
  slug?: string;
};

const normalizeEventIdentifier = (identifier?: EventIdentifier) => ({
  id: identifier?.id ?? undefined,
  slug: identifier?.slug ?? undefined,
});

const ensureEventIdentifier = (identifier: EventIdentifier) => {
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
  const normalized = useMemo(() => normalizeEventIdentifier(identifier), [identifier]);
  const enabled = Boolean(normalized.id || normalized.slug);

  return useQuery({
    queryKey: eventQueryKey(normalized),
    enabled,
    queryFn: () => fetchEvent(normalized),
  });
};

type UseEventsOptions = {
  organizerId?: string;
  enabled?: boolean;
};

const normalizeEventsOptions = (options?: UseEventsOptions) => ({
  organizerId: options?.organizerId ?? undefined,
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

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const useEvents = (options?: UseEventsOptions) => {
  const normalized = normalizeEventsOptions(options);
  const enabled =
    (options?.enabled ?? Boolean(normalized.organizerId)) || options === undefined;

  return useQuery({
    queryKey: eventsQueryKey(options),
    enabled,
    queryFn: () => fetchEvents(options),
  });
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

type UseAttendancesOptions = {
  eventId?: string;
  userId?: string;
  includeProfiles?: boolean;
  includeEvents?: boolean;
  enabled?: boolean;
};

type AttendanceRecord = AttendanceRow & {
  profiles?: ProfileRow | null;
  events?: EventRow | null;
};

const normalizeAttendancesOptions = (options: UseAttendancesOptions) => ({
  eventId: options.eventId ?? undefined,
  userId: options.userId ?? undefined,
  includeProfiles: options.includeProfiles ?? false,
  includeEvents: options.includeEvents ?? false,
});

export const attendancesQueryKey = (options: UseAttendancesOptions) => [
  "attendances",
  normalizeAttendancesOptions(options),
];

export const fetchAttendances = async (
  options: UseAttendancesOptions,
): Promise<AttendanceRecord[]> => {
  if (!options.eventId && !options.userId) {
    throw new Error("eventId or userId must be provided");
  }

  const normalized = normalizeAttendancesOptions(options);

  const selectParts = ["*"];

  if (normalized.includeProfiles) {
    selectParts.push("profiles(*)");
  }

  if (normalized.includeEvents) {
    selectParts.push("events(*)");
  }

  const selectClause = selectParts.join(", ");

  let query = supabase.from("attendances").select(selectClause);

  if (normalized.eventId) {
    query = query.eq("event_id", normalized.eventId);
  }

  if (normalized.userId) {
    query = query.eq("user_id", normalized.userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as AttendanceRecord[];
};

export const useAttendances = (options: UseAttendancesOptions) => {
  const enabled =
    (options.enabled ?? true) && Boolean(options.eventId || options.userId);

  return useQuery({
    queryKey: attendancesQueryKey(options),
    enabled,
    queryFn: () => fetchAttendances(options),
  });
};

export const useUpcoming = (
  userId?: string,
  options?: { enabled?: boolean },
): UseQueryResult<EventRow[], Error> => {
  const enabled = options?.enabled ?? Boolean(userId);

  return useQuery({
    queryKey: ["upcoming-events", userId],
    enabled,
    queryFn: async () => {
      if (!userId) {
        throw new Error("User id required to fetch upcoming events");
      }

      const records = await fetchAttendances({
        userId,
        includeEvents: true,
      });

      return (records ?? [])
        .map((attendance) => attendance.events)
        .filter(Boolean) as EventRow[];
    },
  });
};

export const profileQueryKey = (userId?: string) => ["profile", userId];

const fetchProfile = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const useMyProfile = (userId?: string) => {
  return useQuery({
    queryKey: profileQueryKey(userId),
    enabled: Boolean(userId),
    queryFn: () => fetchProfile(userId!),
  });
};

type JoinEventVariables = {
  eventId: string;
  userId: string;
  source?: string;
};

type LeaveEventVariables = {
  eventId: string;
  userId: string;
};

type CreateEventVariables = Database["public"]["Tables"]["events"]["Insert"];

export const useJoinEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId, source }: JoinEventVariables) => {
      const { error } = await supabase.from("attendances").insert({
        event_id: eventId,
        user_id: userId,
        source: source ?? "manual",
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};

export const useLeaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: LeaveEventVariables) => {
      const { error } = await supabase
        .from("attendances")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
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

      return data as EventRow;
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

export type { EventRow, ProfileRow, AttendanceRecord };
