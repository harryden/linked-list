import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export const profileQueryKey = (userId?: string) => ["profile", userId];

export const fetchProfile = async (
  userId: string,
): Promise<ProfileRow | null> => {
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
