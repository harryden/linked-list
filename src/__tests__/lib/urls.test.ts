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
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkedlist.app");
      expect(getBaseUrl()).toBe("http://localhost:3000");
    });

    it("should use VITE_PUBLIC_URL if window.location is undefined", () => {
      vi.stubGlobal("window", undefined);
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkedlist.app/");
      expect(getBaseUrl()).toBe("https://app.linkedlist.app");
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
      vi.stubEnv("VITE_PUBLIC_URL", "https://app.linkedlist.app");
      expect(getEventUrl("my-event")).toBe(
        "http://localhost:3000/event/my-event",
      );
    });
  });

  describe("getProductionUrl", () => {
    it("should prioritize VITE_PUBLIC_URL", () => {
      vi.stubEnv("VITE_PUBLIC_URL", "https://prod.linkedlist.app/");
      expect(getProductionUrl()).toBe("https://prod.linkedlist.app");
    });

    it("should fall back to localhost in development when VITE_PUBLIC_URL is unset", () => {
      expect(getProductionUrl(false)).toBe("http://localhost:8080");
    });

    it("should throw an error in production when VITE_PUBLIC_URL is unset", () => {
      expect(() => getProductionUrl(true)).toThrow(
        "VITE_PUBLIC_URL environment variable is required in production",
      );
    });
  });
});
