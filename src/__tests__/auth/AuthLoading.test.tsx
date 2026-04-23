import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/pages/Auth";
import type { Mock } from "vitest";
import { describe, expect, it } from "vitest";

const getSessionMock = supabase.auth.getSession as unknown as Mock;

describe("Auth loading", () => {
  it("shows a loading state before the session check finishes", async () => {
    let resolveSession:
      | ((value: { data: { session: null }; error: null }) => void)
      | undefined;

    getSessionMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSession = resolve;
      }),
    );

    renderWithProviders(<Auth />, { route: "/auth" });

    expect(screen.getByText(/Loading sign in/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Sign in with LinkedIn/i }),
    ).not.toBeInTheDocument();

    resolveSession?.({ data: { session: null }, error: null });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Sign in with LinkedIn/i }),
      ).toBeInTheDocument();
    });
  });

  it("hides the auth card while LinkedIn redirect is pending", async () => {
    const user = userEvent.setup();

    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    supabase.auth.signInWithOAuth.mockReturnValueOnce(new Promise(() => {}));

    renderWithProviders(<Auth />, { route: "/auth" });

    await user.click(
      await screen.findByRole("button", { name: /Sign in with LinkedIn/i }),
    );

    expect(screen.getByText(/Redirecting to LinkedIn/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Enter event code/i }),
    ).not.toBeInTheDocument();
  });
});
