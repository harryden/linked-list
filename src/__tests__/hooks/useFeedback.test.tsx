import { renderHook } from "@testing-library/react";
import { useFeedback } from "@/hooks/useFeedback";
import { supabaseStub, resetSupabaseStub } from "@/test-utils/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe("useFeedback", () => {
  beforeEach(() => {
    resetSupabaseStub();
  });

  it("should securely fetch the current user and insert feedback into the database", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useFeedback(), { wrapper });

    await result.current.mutateAsync({
      type: "bug",
      message: "Test feedback",
      page_path: "/test",
    });

    expect(supabaseStub.auth.getUser).toHaveBeenCalled();
    expect(supabaseStub.from).toHaveBeenCalledWith("feedback");
  });

  it("should fail with an authentication error when no user session is present", async () => {
    const authError = new Error("Auth session missing");
    authError.name = "AuthSessionMissingError";
    supabaseStub.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: authError,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useFeedback(), { wrapper });

    await expect(
      result.current.mutateAsync({
        type: "bug",
        message: "Test feedback",
      }),
    ).rejects.toThrow("Authentication required to submit feedback");
  });
});
