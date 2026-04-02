/**
 * Derives a short 6-digit numeric code from a UUID event ID.
 * Used to give attendees an easy code to reference at check-in.
 */
export function eventCodeFromId(id: string): string {
  return Math.abs(parseInt(id.replace(/-/g, "").substring(0, 8), 16) % 1000000)
    .toString()
    .padStart(6, "0");
}
