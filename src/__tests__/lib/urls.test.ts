import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBaseUrl, getEventUrl, getProductionUrl } from "@/lib/urls";

describe("URL Helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { origin: "http://localhost:3000" });
    vi.stubEnv("VITE_PUBLIC_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("getBaseUrl", () => {
    it("should prioritize window.location.origin over VITE_PUBLIC_URL", () => {
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkback.com");
      expect(getBaseUrl()).toBe("http://localhost:3000");
    });

    it("should use VITE_PUBLIC_URL if window.location is undefined", () => {
      vi.stubGlobal("window", undefined);
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkback.com/");
      expect(getBaseUrl()).toBe("https://app.linkback.com");
    });

    it("should fall back to window.location.origin if VITE_PUBLIC_URL is not set", () => {
      expect(getBaseUrl()).toBe("http://localhost:3000");
    });

    it("should trim trailing slashes from origin", () => {
      vi.stubGlobal("location", { origin: "http://localhost:3000/" });
      expect(getBaseUrl()).toBe("http://localhost:3000");
    });
  });

  describe("getEventUrl", () => {
    it("should return a correctly formatted event URL using origin", () => {
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkback.com");
      expect(getEventUrl("my-event")).toBe(
        "http://localhost:3000/event/my-event",
      );
    });
  });

  describe("getProductionUrl", () => {
    it("should prioritize VITE_PUBLIC_URL", () => {
      vi.stubEnv("VITE_PUBLIC_URL", "https://prod.linkback.com/");
      expect(getProductionUrl()).toBe("https://prod.linkback.com");
    });

    it("should fall back to the correct production domain when VITE_PUBLIC_URL is unset", () => {
      expect(getProductionUrl()).toBe(
        "https://linked-list-harry-denells-projects.vercel.app",
      );
    });
  });
});
