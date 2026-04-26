import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFeedback } from "@/hooks/useFeedback";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
};

describe("useFeedback hook", () => {
  it("uses getUser() to ensure a fresh session before inserting feedback", async () => {
    const { wrapper } = createWrapper();
    const user = { id: "user-123" };

    // Mock getUser() success
    supabaseStub.auth.getUser.mockResolvedValue({
      data: { user },
      error: null,
    });

    const query = createQueryStub({ baseResult: { data: null, error: null } });
    query.insert.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("feedback");
      return query;
    });

    const { result } = renderHook(() => useFeedback(), { wrapper });

    await result.current.mutateAsync({
      category: "general",
      message: "Great app!",
      page_path: "/dashboard",
    });

    // Verify getUser was called, not getSession
    expect(supabaseStub.auth.getUser).toHaveBeenCalled();
    expect(supabaseStub.auth.getSession).not.toHaveBeenCalled();

    // Verify insert used the user ID from getUser()
    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-123",
        message: "Great app!",
      }),
    );
  });

  it("throws the original error for network failures", async () => {
    const { wrapper } = createWrapper();

    // Mock getUser() failure
    supabaseStub.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("Network error"),
    });

    const { result } = renderHook(() => useFeedback(), { wrapper });

    await expect(
      result.current.mutateAsync({
        category: "general",
        message: "Great app!",
        page_path: "/dashboard",
      }),
    ).rejects.toThrow("Network error");
  });

  it("throws authentication error if getUser() returns an auth error or no user", async () => {
    const { wrapper } = createWrapper();

    const authError = new Error("Auth Error");
    authError.name = "AuthSessionMissingError";

    // Mock getUser() failure
    supabaseStub.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: authError,
    });

    const { result } = renderHook(() => useFeedback(), { wrapper });

    await expect(
      result.current.mutateAsync({
        category: "general",
        message: "Great app!",
        page_path: "/dashboard",
      }),
    ).rejects.toThrow("Authentication required to submit feedback");
  });
});
