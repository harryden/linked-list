import { format, isValid, parseISO } from "date-fns";
import { logger } from "@/lib/logger";

export function getDashboardGreeting(
  name?: string | null,
  hostedCount = 0,
  attendedCount = 0,
): string {
  const firstName = name?.split(" ")[0];

  if (hostedCount === 0 && attendedCount === 0) {
    return firstName ? `Welcome, ${firstName}!` : "Welcome!";
  }

  return firstName ? `Welcome back, ${firstName}!` : "Welcome back!";
}

export function eventCodeFromId(id: string): string {
  return Math.abs(parseInt(id.replace(/-/g, "").substring(0, 8), 16) % 1000000)
    .toString()
    .padStart(6, "0");
}

export function generateSlug(name: string): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "event";

  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomSuffix}`;
}

export function parseEventDateParts(input?: string | null) {
  if (!input) {
    return { date: "", time: "" };
  }

  try {
    const date = parseISO(input);
    if (!isValid(date)) {
      return { date: "", time: "" };
    }
    return {
      date: format(date, "yyyy-MM-dd"),
      time: format(date, "HH:mm"),
    };
  } catch (error) {
    logger.error(error, { category: "Events" });
    return { date: "", time: "" };
  }
}

export function combineEventDateAndTime(
  date: string,
  time: string,
): string | null {
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
    logger.error(error, { category: "Events" });
    return null;
  }
}
