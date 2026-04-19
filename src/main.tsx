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

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById("root")!).render(<App />);
