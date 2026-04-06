import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { logger } from "@/lib/logger";

window.addEventListener("unhandledrejection", (event) => {
  logger.error(event.reason, { category: "GlobalUnhandledRejection" });
});

window.addEventListener("error", (event) => {
  logger.error(event.error, { category: "GlobalError" });
});

if (location.pathname.startsWith("/event/")) {
  import("./pages/EventPage").catch(() => {});
}

const lenis = new Lenis({ lerp: 0.06 });

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById("root")!).render(<App />);
