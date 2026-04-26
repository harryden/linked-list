import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  fetchPublicOrganizerProfile,
  fetchProfile,
  usePublicOrganizerProfile,
} from "@/hooks/useProfile";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { wrapper };
};

describe("useProfile hooks", () => {
  it("fetchProfile reads the full profiles table for authenticated profile access", async () => {
    const result = {
      data: {
        id: "user-1",
        name: "Ada Lovelace",
        headline: "Engineer",
        linkedin_id: "ada-lovelace",
      },
      error: null,
    };
    const query = createQueryStub({ maybeSingleResult: result });
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("profiles");
      return query;
    });

    const data = await fetchProfile("user-1");

    expect(query.select).toHaveBeenCalledWith("*");
    expect(query.eq).toHaveBeenCalledWith("id", "user-1");
    expect(data).toEqual(result.data);
  });

  it("fetchPublicOrganizerProfile reads only from the public organizer view", async () => {
    const result = {
      data: {
        id: "user-1",
        name: "Ada Lovelace",
        avatar_url: "https://example.com/avatar.png",
      },
      error: null,
    };
    const query = createQueryStub({ maybeSingleResult: result });
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("public_organizer_profiles");
      return query;
    });

    const data = await fetchPublicOrganizerProfile("user-1");

    expect(query.select).toHaveBeenCalledWith("id, name, avatar_url");
    expect(query.eq).toHaveBeenCalledWith("id", "user-1");
    expect(data).toEqual(result.data);
  });

  it("usePublicOrganizerProfile disables the query until a user id is provided", () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePublicOrganizerProfile(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.status).toBe("pending");
  });
});
