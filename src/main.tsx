import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { logger } from "@/lib/logger";
import { lenis } from "@/lib/lenis";

window.addEventListener("unhandledrejection", (event) => {
  logger.error(event.reason, { category: "GlobalUnhandledRejection" });
});

window.addEventListener("error", (event) => {
  logger.error(event.error, { category: "GlobalError" });
});

if (location.pathname.startsWith("/event/")) {
  // Non-critical preload — ignore failures, the route will load on demand
  import("./pages/EventPage").catch(() => {});
}

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let rafId: number | null = null;

function raf(time: number) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}

function startRaf() {
  if (rafId === null) rafId = requestAnimationFrame(raf);
}

function stopRaf() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function updateLenisMotion() {
  reducedMotionQuery.matches ? stopRaf() : startRaf();
}

reducedMotionQuery.addEventListener("change", updateLenisMotion);
updateLenisMotion();

createRoot(document.getElementById("root")!).render(<App />);
