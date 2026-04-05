import { Link } from "react-router-dom";

interface FloatingCTAProps {
  visible: boolean;
}

const FloatingCTA = ({ visible }: FloatingCTAProps) => (
  <div
    style={{
      position: "absolute",
      left: "5%",
      top: "50%",
      transform: `translateY(-50%) translateX(${visible ? "0" : "-20px"})`,
      opacity: visible ? 1 : 0,
      transition: "opacity 600ms ease, transform 600ms ease",
      pointerEvents: visible ? "auto" : "none",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 340,
    }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        fontFamily: "var(--font-brand)",
      }}
    >
      LinkBack
    </span>

    <div
      style={{
        fontFamily: "var(--font-brand)",
        lineHeight: 0.92,
        letterSpacing: "-0.05em",
      }}
    >
      <div
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 900,
          color: "#fff",
        }}
      >
        Check in.
      </div>
      <div
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.6)",
        }}
      >
        Stand out.
      </div>
    </div>

    <p
      style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.6,
        fontFamily: "var(--font-brand)",
      }}
    >
      LinkedIn-verified attendance for events that matter.
    </p>

    <Link to="/auth" style={{ textDecoration: "none" }}>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          color: "#111",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px 22px",
          borderRadius: 28,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-brand)",
          letterSpacing: "-0.01em",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            background: "#0a66c2",
            borderRadius: 4,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          in
        </span>
        Sign in with LinkedIn
      </button>
    </Link>

    <Link
      to="/demo"
      style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-brand)",
        textDecoration: "underline",
        textUnderlineOffset: 3,
      }}
    >
      See how it works →
    </Link>
  </div>
);

export default FloatingCTA;
