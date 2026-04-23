import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useFeedback } from "@/hooks/useFeedback";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";
import { analytics } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  analytics: {
    track: vi.fn(),
  },
}));

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
};

describe("useFeedback", () => {
  it("submits feedback and tracks analytics", async () => {
    const { wrapper } = createWrapper();
    const mockSession = {
      session: {
        user: { id: "user-1" },
      },
    };

    supabaseStub.auth.getSession.mockResolvedValue({
      data: mockSession,
      error: null,
    });

    const query = createQueryStub({ baseResult: { data: null, error: null } });
    query.insert.mockReturnValue(query);

    supabaseStub.from.mockImplementation((table) => {
      if (table === "feedback") return query;
      return createQueryStub({});
    });

    const { result } = renderHook(() => useFeedback(), { wrapper });

    await result.current.mutateAsync({
      type: "bug",
      message: "Test feedback",
      page_path: "/test",
    });

    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "bug",
        message: "Test feedback",
        page_path: "/test",
        user_id: "user-1",
        user_agent: expect.any(String),
      }),
    );

    expect(analytics.track).toHaveBeenCalledWith("feedback_submitted", {
      type: "bug",
    });
  });

  it("throws error if not authenticated", async () => {
    const { wrapper } = createWrapper();

    supabaseStub.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useFeedback(), { wrapper });

    await expect(
      result.current.mutateAsync({
        type: "feature",
        message: "Idea",
      }),
    ).rejects.toThrow("Authentication required to submit feedback");
  });
});
