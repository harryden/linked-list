import { render, screen } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("ErrorBoundary", () => {
  const originalLocation = window.location;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  beforeEach(() => {
    // @ts-expect-error: window.location is read-only but we need to mock it
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
    sessionStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  it("should trigger a hard reload when a dynamic import failure occurs to recover from stale deployments", () => {
    const ThrowingComponent = () => {
      const error = new Error("Loading chunk 123 failed");
      error.name = "ChunkLoadError";
      throw error;
    };

    render(
      <AllProviders>
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      </AllProviders>,
    );

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should stop reloading and show error UI if a chunk error persists (reload loop guard)", () => {
    // Simulate that we just reloaded 1 second ago
    const now = Date.now();
    sessionStorage.setItem("last-chunk-error-reload", (now - 1000).toString());

    const ThrowingComponent = () => {
      const error = new Error("Loading chunk 123 failed");
      error.name = "ChunkLoadError";
      throw error;
    };

    render(
      <AllProviders>
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      </AllProviders>,
    );

    // Should NOT reload this time
    expect(window.location.reload).not.toHaveBeenCalled();
    // Should show error UI instead
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("should trigger a hard reload when a module script fetch fails", () => {
    const ThrowingComponent = () => {
      throw new Error(
        "Failed to fetch dynamically imported module: /src/pages/Auth.tsx",
      );
    };

    render(
      <AllProviders>
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      </AllProviders>,
    );

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should display the fallback UI for non-deployment related rendering errors", () => {
    const ThrowingComponent = () => {
      throw new Error("Generic component error");
    };

    render(
      <AllProviders>
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      </AllProviders>,
    );

    expect(window.location.reload).not.toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
