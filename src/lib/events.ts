import { format, parseISO } from "date-fns";

/**
 * Derives a short 6-digit numeric code from a UUID event ID.
 * Used to give attendees an easy code to reference at check-in.
 */
export function eventCodeFromId(id: string): string {
  return Math.abs(parseInt(id.replace(/-/g, "").substring(0, 8), 16) % 1000000)
    .toString()
    .padStart(6, "0");
}

/**
 * Generates a URL-friendly slug from a name with a random suffix.
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomSuffix}`;
}

/**
 * Parses an ISO date string into its date (YYYY-MM-DD) and time (HH:mm) components.
 */
export function parseEventDateParts(input?: string | null) {
  if (!input) {
    return { date: "", time: "" };
  }

  try {
    const date = parseISO(input);
    return {
      date: format(date, "yyyy-MM-dd"),
      time: format(date, "HH:mm"),
    };
  } catch (error) {
    console.error("Error parsing date:", error);
    return { date: "", time: "" };
  }
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:mm) into an ISO string.
 */
export function combineEventDateAndTime(date: string, time: string): string | null {
  if (!date || !time) {
    return null;
  }

  try {
    const combined = new Date(`${date}T${time}`);
    if (isNaN(combined.getTime())) {
      return null;
    }
    return combined.toISOString();
  } catch (error) {
    console.error("Error combining date and time:", error);
    return null;
  }
}
