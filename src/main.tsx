import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logger } from "@/lib/logger";

// Catch unhandled promise rejections (e.g. Supabase failures)
window.addEventListener("unhandledrejection", (event) => {
  logger.error(event.reason, { category: "GlobalUnhandledRejection" });
});

// Catch global errors not caught by React ErrorBoundary
window.addEventListener("error", (event) => {
  logger.error(event.error, { category: "GlobalError" });
});

// Preload EventPage chunk when entering via deep link
if (location.pathname.startsWith("/event/")) {
  import("./pages/EventPage").catch(() => {
    // Non-critical preload — ignore failures, the route will load on demand
  });
}

createRoot(document.getElementById("root")!).render(<App />);
