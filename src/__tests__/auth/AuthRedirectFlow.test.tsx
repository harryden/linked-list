import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import { TEXT } from "@/constants/text";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("sonner", async () => {
  const actual = await vi.importActual<typeof import("sonner")>("sonner");

  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  };
});

const getSessionMock = supabase.auth.getSession as unknown as Mock;
const signInMock = supabase.auth.signInWithOAuth as unknown as Mock;
const onAuthStateChangeMock = supabase.auth
  .onAuthStateChange as unknown as Mock;

const configureSignIn = () =>
  signInMock.mockResolvedValue({ data: null, error: null });

describe("Auth redirect flow", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    signInMock.mockClear();
    getSessionMock.mockClear();
    onAuthStateChangeMock.mockReset();
  });

  it("preserves a safe redirect path from the query string when starting OAuth", async () => {
    const user = userEvent.setup();
    configureSignIn();
    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithProviders(<Auth />, {
      route: "/auth?redirect=/event/test-event",
    });

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.auth.card.buttonIdle, "i"),
      }),
    );

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=%2Fevent%2Ftest-event`,
        scopes: "openid profile email",
      },
    });
  });

  it("falls back to root when the redirect path is unsafe", async () => {
    const user = userEvent.setup();
    configureSignIn();
    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithProviders(<Auth />, {
      route: "/auth?redirect=https://malicious.example",
    });

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(TEXT.auth.card.buttonIdle, "i"),
      }),
    );

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=%2F`,
        scopes: "openid profile email",
      },
    });
  });

  it("navigates to the next path encoded in the callback URL on successful auth", async () => {
    mockNavigate.mockReset();

    onAuthStateChangeMock.mockImplementation((cb) => {
      queueMicrotask(() => cb("SIGNED_IN", { user: { id: "user_test" } }));
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    renderWithProviders(<AuthCallback />, {
      route: "/auth/callback?next=%2Fevent%2Ftest-event",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/event/test-event", {
        replace: true,
      });
    });
  });

  it("navigates to the next path on INITIAL_SESSION with valid session", async () => {
    mockNavigate.mockReset();

    onAuthStateChangeMock.mockImplementation((cb) => {
      queueMicrotask(() =>
        cb("INITIAL_SESSION", { user: { id: "user_test" } }),
      );
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    renderWithProviders(<AuthCallback />, {
      route: "/auth/callback?next=%2Fdashboard",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", {
        replace: true,
      });
    });
  });

  it("redirects to auth on failed session establishment", async () => {
    mockNavigate.mockReset();

    onAuthStateChangeMock.mockImplementation((cb) => {
      queueMicrotask(() => cb("SIGNED_OUT", null));
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    renderWithProviders(<AuthCallback />, {
      route: "/auth/callback",
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/auth");
      },
      { timeout: 3000 },
    );
  });
});
