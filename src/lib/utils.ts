import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSafeRedirect(path: string | null | undefined): boolean {
  if (!path || typeof path !== "string") return false;
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}
