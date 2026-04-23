import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  fetchOrganizerPublicProfile,
  useOrganizerPublicProfile,
} from "@/hooks/useProfile";
import {
  createQueryStub,
  supabaseStub,
  resetSupabaseStub,
} from "@/test-utils/supabase";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
};

describe("useOrganizerPublicProfile", () => {
  beforeEach(() => {
    resetSupabaseStub();
  });

  it("queries organizer_public_profiles view, not the profiles table", async () => {
    const publicProfile = { id: "org-1", name: "Jane Doe", avatar_url: null };
    const query = createQueryStub({
      maybeSingleResult: { data: publicProfile, error: null },
    });
    query.select = vi.fn().mockReturnValue(query);
    query.eq = vi.fn().mockReturnValue(query);
    supabaseStub.from.mockReturnValue(query);

    await fetchOrganizerPublicProfile("org-1");

    expect(supabaseStub.from).toHaveBeenCalledWith("organizer_public_profiles");
    expect(supabaseStub.from).not.toHaveBeenCalledWith("profiles");
  });

  it("selects only id, name, and avatar_url — no sensitive columns", async () => {
    const publicProfile = { id: "org-1", name: "Jane Doe", avatar_url: null };
    const query = createQueryStub({
      maybeSingleResult: { data: publicProfile, error: null },
    });
    query.select = vi.fn().mockReturnValue(query);
    query.eq = vi.fn().mockReturnValue(query);
    supabaseStub.from.mockReturnValue(query);

    await fetchOrganizerPublicProfile("org-1");

    expect(query.select).toHaveBeenCalledWith("id, name, avatar_url");
  });

  it("returns only the public fields from the view", async () => {
    const publicProfile = { id: "org-1", name: "Jane Doe", avatar_url: null };
    const query = createQueryStub({
      maybeSingleResult: { data: publicProfile, error: null },
    });
    query.select = vi.fn().mockReturnValue(query);
    query.eq = vi.fn().mockReturnValue(query);
    supabaseStub.from.mockReturnValue(query);

    const result = await fetchOrganizerPublicProfile("org-1");

    expect(result).toEqual({ id: "org-1", name: "Jane Doe", avatar_url: null });
    expect(result).not.toHaveProperty("linkedin_id");
    expect(result).not.toHaveProperty("headline");
    expect(result).not.toHaveProperty("role");
  });

  it("is disabled when no organizerId is provided", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useOrganizerPublicProfile(undefined), {
      wrapper,
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches when organizerId is provided", async () => {
    const publicProfile = { id: "org-1", name: "Jane Doe", avatar_url: null };
    const query = createQueryStub({
      maybeSingleResult: { data: publicProfile, error: null },
    });
    query.select = vi.fn().mockReturnValue(query);
    query.eq = vi.fn().mockReturnValue(query);
    supabaseStub.from.mockReturnValue(query);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useOrganizerPublicProfile("org-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(publicProfile);
  });
});
