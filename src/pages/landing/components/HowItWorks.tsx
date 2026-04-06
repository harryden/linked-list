import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 600ms ease, transform 600ms ease",
        fontFamily: "var(--font-brand)",
      }}
    >
      <div
        style={{
          fontSize: "clamp(64px, 8vw, 96px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.15)",
          flexShrink: 0,
          width: 100,
        }}
      >
        {number}
      </div>
      <div style={{ paddingTop: 12 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = t("landing.howItWorks.steps", { returnObjects: true }) as {
    step: string;
    title: string;
    description: string;
  }[];

  return (
    <section
      id="how-it-works"
      style={{
        background: "#0a0a0a",
        padding: "120px 5%",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.04em",
            marginBottom: 80,
            fontFamily: "var(--font-brand)",
          }}
        >
          {t("landing.howItWorks.title")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {steps.map(({ step, title, description }) => (
            <Step
              key={step}
              number={String(step).padStart(2, "0")}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
