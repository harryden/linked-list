import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CHUNK_ERROR_RELOAD_KEY } from "@/lib/chunkReload";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ErrorBoundary", () => {
  const originalLocation = window.location;
  const originalSessionStorage = window.sessionStorage;
  const reload = vi.fn();

  beforeEach(() => {
    reload.mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: originalSessionStorage,
    });
    sessionStorage.clear();
    vi.spyOn(console, "group").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "dir").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: originalSessionStorage,
    });
    vi.restoreAllMocks();
  });

  it("reloads once when a lazy route chunk is stale after deployment", async () => {
    const ThrowingComponent = () => {
      const error = new Error("Loading chunk 123 failed");
      error.name = "ChunkLoadError";
      throw error;
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  });

  it("shows the fallback when chunk reload already happened recently", () => {
    sessionStorage.setItem(
      CHUNK_ERROR_RELOAD_KEY,
      (Date.now() - 1000).toString(),
    );

    const ThrowingComponent = () => {
      const error = new Error("Loading chunk 123 failed");
      error.name = "ChunkLoadError";
      throw error;
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("reloads when a dynamic import fetch fails", async () => {
    const ThrowingComponent = () => {
      throw new Error(
        "Failed to fetch dynamically imported module: /assets/Auth.js",
      );
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  });

  it("reloads when a module script import fails", async () => {
    const ThrowingComponent = () => {
      throw new Error("Importing a module script failed");
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  });

  it("shows the fallback when storage blocks the reload guard", () => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: {
        clear: vi.fn(),
        getItem: vi.fn(() => {
          throw new Error("Storage unavailable");
        }),
        setItem: vi.fn(),
      },
    });

    const ThrowingComponent = () => {
      const error = new Error("Loading chunk 123 failed");
      error.name = "ChunkLoadError";
      throw error;
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows the fallback for non-deployment rendering errors", () => {
    const ThrowingComponent = () => {
      throw new Error("Generic component error");
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
