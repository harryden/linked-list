import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #5606ff 0%, #8b35ff 50%, #fe8989 100%)",
        padding: "120px 5%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          fontFamily: "var(--font-brand)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {t("landing.footerCta.title")}
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
            maxWidth: 440,
          }}
        >
          {t("landing.footerCta.description")}
        </p>
        <Link
          to="/auth"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            color: "#111",
            fontSize: 16,
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: 32,
            textDecoration: "none",
            cursor: "pointer",
            fontFamily: "var(--font-brand)",
            letterSpacing: "-0.01em",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              background: "#0a66c2",
              borderRadius: 4,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            in
          </span>
          {t("common.buttons.signInWithLinkedIn")}
        </Link>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--font-brand)",
          }}
        >
          {t("common.copy.footer")}
        </p>
      </div>
    </section>
  );
};

export default FooterCTA;
