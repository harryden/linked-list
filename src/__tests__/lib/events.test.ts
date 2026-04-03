import { describe, it, expect } from "vitest";
import {
  eventCodeFromId,
  generateSlug,
  parseEventDateParts,
  combineEventDateAndTime,
} from "@/lib/events";

describe("eventCodeFromId", () => {
  it("returns a 6-character string", () => {
    const code = eventCodeFromId("550e8400-e29b-41d4-a716-446655440000");
    expect(code).toHaveLength(6);
  });

  it("pads with leading zeros when the hash value is small", () => {
    const code = eventCodeFromId("00000000-0000-0000-0000-000000000000");
    expect(code).toMatch(/^\d{6}$/);
  });

  it("produces a consistent result for the same input", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(eventCodeFromId(id)).toBe(eventCodeFromId(id));
  });

  it("produces different codes for different UUIDs", () => {
    const code1 = eventCodeFromId("aaaaaaaa-0000-0000-0000-000000000000");
    const code2 = eventCodeFromId("bbbbbbbb-0000-0000-0000-000000000000");
    expect(code1).not.toBe(code2);
  });

  it("only contains digits", () => {
    const code = eventCodeFromId("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    expect(code).toMatch(/^\d+$/);
  });
});

describe("generateSlug", () => {
  it("lowercases the input", () => {
    const slug = generateSlug("Tech Meetup");
    expect(slug).toMatch(/^tech-meetup-/);
  });

  it("replaces spaces with hyphens", () => {
    const slug = generateSlug("my event name");
    expect(slug).toMatch(/^my-event-name-/);
  });

  it("removes special characters", () => {
    const slug = generateSlug("Hello, World! 2025");
    expect(slug).toMatch(/^hello-world-2025-/);
  });

  it("appends a random 6-character alphanumeric suffix", () => {
    const slug = generateSlug("Event");
    const parts = slug.split("-");
    const suffix = parts[parts.length - 1];
    expect(suffix).toMatch(/^[a-z0-9]{6}$/);
  });

  it("falls back to 'event' base when name is empty", () => {
    const slug = generateSlug("");
    expect(slug).toMatch(/^event-/);
  });

  it("falls back to 'event' base when name contains only special characters", () => {
    const slug = generateSlug("!!!---");
    expect(slug).toMatch(/^event-/);
  });

  it("produces unique slugs for the same name across calls", () => {
    const slug1 = generateSlug("Meetup");
    const slug2 = generateSlug("Meetup");
    expect(slug1).not.toBe(slug2);
  });

  it("trims leading and trailing hyphens from the base", () => {
    const slug = generateSlug("-hello-");
    expect(slug).toMatch(/^hello-/);
  });
});

describe("parseEventDateParts", () => {
  it("returns empty strings when input is null", () => {
    expect(parseEventDateParts(null)).toEqual({ date: "", time: "" });
  });

  it("returns empty strings when input is undefined", () => {
    expect(parseEventDateParts(undefined)).toEqual({ date: "", time: "" });
  });

  it("returns empty strings when input is an empty string", () => {
    expect(parseEventDateParts("")).toEqual({ date: "", time: "" });
  });

  it("parses a valid ISO string into date and time parts", () => {
    const result = parseEventDateParts("2025-05-15T14:30:00.000Z");
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.time).toMatch(/^\d{2}:\d{2}$/);
  });

  it("extracts the correct date from an ISO string", () => {
    const result = parseEventDateParts("2025-03-01T00:00:00.000Z");
    expect(result.date).toBe("2025-03-01");
  });

  it("returns empty strings for a clearly malformed date string", () => {
    const result = parseEventDateParts("not-a-date");
    expect(result.date).toBe("");
    expect(result.time).toBe("");
  });
});

describe("combineEventDateAndTime", () => {
  it("returns null when date is empty", () => {
    expect(combineEventDateAndTime("", "10:00")).toBeNull();
  });

  it("returns null when time is empty", () => {
    expect(combineEventDateAndTime("2025-05-01", "")).toBeNull();
  });

  it("returns null when both date and time are empty", () => {
    expect(combineEventDateAndTime("", "")).toBeNull();
  });

  it("returns an ISO string for valid date and time inputs", () => {
    const result = combineEventDateAndTime("2025-05-01", "09:00");
    expect(result).not.toBeNull();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("includes the correct date in the returned ISO string", () => {
    const result = combineEventDateAndTime("2025-12-25", "18:00");
    expect(result).toContain("2025-12-25");
  });

  it("returns null for a date that produces NaN", () => {
    const result = combineEventDateAndTime("not-a-date", "10:00");
    expect(result).toBeNull();
  });
});
