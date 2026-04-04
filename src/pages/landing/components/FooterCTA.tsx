import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 pb-32">
      <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary to-primary rounded-3xl p-12 shadow-xl animate-border-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t("landing.footerCta.title")}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            {t("landing.footerCta.description")}
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium shadow-lg hover:scale-105 transition-transform bg-linkedin hover:bg-linkedin-hover text-white"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              {t("common.buttons.signInWithLinkedIn")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
