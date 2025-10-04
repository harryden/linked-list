import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import { TEXT } from "@/constants/text";
import type { Mock } from "vitest";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

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

const configureSignIn = () =>
  signInMock.mockResolvedValue({
    data: null,
    error: null,
  });

describe("Auth redirect flow", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockReset();
    signInMock.mockClear();
    getSessionMock.mockClear();
  });

  afterEach(() => {
    sessionStorage.clear();
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

    expect(sessionStorage.getItem("postAuthRedirect")).toBe(
      "/event/test-event",
    );
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

    expect(sessionStorage.getItem("postAuthRedirect")).toBe("/");
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "openid profile email",
      },
    });
  });

  it("navigates back to the stored path on successful callback", async () => {
    mockNavigate.mockReset();
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: "user_test" } } },
      error: null,
    });

    sessionStorage.setItem("postAuthRedirect", "/event/test-event");

    renderWithProviders(<AuthCallback />, {
      route: "/auth/callback?redirect=/event/test-event",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/event/test-event", {
        replace: true,
      });
    });

    expect(sessionStorage.getItem("postAuthRedirect")).toBeNull();
  });
});
