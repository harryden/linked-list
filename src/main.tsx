import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

// Preload EventPage chunk when entering via deep link
if (location.pathname.startsWith("/event/")) {
  import("./pages/EventPage").catch(() => {
    // Non-critical preload — ignore failures, the route will load on demand
  });
}

createRoot(document.getElementById("root")!).render(<App />);
