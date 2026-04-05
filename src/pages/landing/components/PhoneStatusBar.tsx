import { useState, useEffect } from "react";

const WifiIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
  </svg>
);

const BatteryIcon = () => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 24 14"
    fill="none"
    stroke="#111"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <rect x="1" y="1" width="18" height="12" rx="2" />
    <path d="M21 5v4" strokeWidth="2.5" />
    <rect x="3" y="3" width="12" height="8" rx="1" fill="#111" stroke="none" />
  </svg>
);

const SignalIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="#111">
    <rect x="1" y="14" width="4" height="9" rx="1" />
    <rect x="7" y="10" width="4" height="13" rx="1" />
    <rect x="13" y="6" width="4" height="17" rx="1" />
    <rect x="19" y="2" width="4" height="21" rx="1" />
  </svg>
);

const PhoneStatusBar = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      );
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px 0",
        background: "#fff",
        position: "relative",
        flexShrink: 0,
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 600,
          color: "#111",
          letterSpacing: "-0.01em",
        }}
      >
        {time}
      </span>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 6,
          width: 44,
          height: 12,
          background: "#000",
          borderRadius: 10,
        }}
      />

      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
};

export default PhoneStatusBar;
