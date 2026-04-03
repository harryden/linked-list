import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates that a redirect path is internal to the application.
 * Prevents protocol-relative URLs (//evil.com) and absolute URLs.
 */
export function isSafeRedirect(path: string | null | undefined): boolean {
  if (!path || typeof path !== "string") return false;
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}
