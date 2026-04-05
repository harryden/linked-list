import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";
import linkbackLogo from "@/assets/linkback-logo.png";

interface LandingNavProps {
  user: User | null;
  onSignOut: () => void;
}

const LandingNav = ({ user, onSignOut }: LandingNavProps) => {
  const { t } = useTranslation();

  return (
    <header
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
      className="px-6 py-3 flex items-center justify-between"
    >
      <img
        src={linkbackLogo}
        alt="LinkBack"
        className="h-12 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/dashboard">
              <button
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  borderRadius: 24,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {t("common.buttons.myEvents")}
              </button>
            </Link>
            <button
              onClick={onSignOut}
              aria-label={t("common.buttons.signOut")}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <Link to="/auth">
            <button
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                borderRadius: 24,
                padding: "8px 18px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-brand)",
              }}
            >
              {t("common.buttons.signInWithLinkedIn")}
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default LandingNav;
