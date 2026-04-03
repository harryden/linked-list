import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { EventRow } from "./useEvents";
import type { ProfileRow } from "./useProfile";

export type AttendanceRow = Database["public"]["Tables"]["attendances"]["Row"];

export type UseAttendancesOptions = {
  eventId?: string;
  userId?: string;
  includeProfiles?: boolean;
  includeEvents?: boolean;
  enabled?: boolean;
};

export type AttendanceRecord = AttendanceRow & {
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

type JoinEventVariables = {
  eventId: string;
  userId: string;
  source?: string;
};

type LeaveEventVariables = {
  eventId: string;
  userId: string;
};

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
