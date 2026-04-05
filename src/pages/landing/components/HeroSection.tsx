import { useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";
import PhoneReveal from "./PhoneReveal";
import FloatingCTA from "./FloatingCTA";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phaseA, step, showFloatingCTA } = useScrollProgress(containerRef);

  return (
    <div ref={containerRef} style={{ height: "600vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "5%",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: showFloatingCTA ? 0 : 1,
            transition: "opacity 600ms ease",
            zIndex: 2,
            fontFamily: "var(--font-brand)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            Check
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            in.
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.55)",
            }}
          >
            Stand
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.55)",
            }}
          >
            out.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: phaseA > 0.05 ? 0 : 1,
            transition: "opacity 400ms ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            zIndex: 2,
          }}
        >
          <div
            className="animate-scroll-pulse"
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
            }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-brand)",
            }}
          >
            SCROLL
          </span>
        </div>

        <PhoneReveal phaseA={phaseA} step={step} />

        <FloatingCTA visible={showFloatingCTA} />
      </div>
    </div>
  );
};

export default HeroSection;
