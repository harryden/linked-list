import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type PublicOrganizerProfileRow =
  Database["public"]["Views"]["public_organizer_profiles"]["Row"];

export const profileQueryKey = (userId?: string) => ["profile", userId];
export const publicOrganizerProfileQueryKey = (userId?: string) => [
  "public-organizer-profile",
  userId,
];

export const fetchProfile = async (
  userId: string,
  retryCount = 0,
): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // If profile doesn't exist yet, retry once after a short delay
  // This handles the race condition with the Supabase Auth -> Profiles trigger
  if (!data && retryCount < 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return fetchProfile(userId, retryCount + 1);
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

export const fetchPublicOrganizerProfile = async (
  userId: string,
): Promise<PublicOrganizerProfileRow | null> => {
  const { data, error } = await supabase
    .from("public_organizer_profiles")
    .select("id, name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const usePublicOrganizerProfile = (userId?: string) => {
  return useQuery({
    queryKey: publicOrganizerProfileQueryKey(userId),
    enabled: Boolean(userId),
    queryFn: () => fetchPublicOrganizerProfile(userId!),
  });
};
