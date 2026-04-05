import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 pb-32 border-t border-border">
      <div className="max-w-4xl">
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-none mb-6">
          {t("landing.footerCta.title")}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          {t("landing.footerCta.description")}
        </p>
        <Link to="/auth">
          <Button
            size="lg"
            className="px-8 bg-linkedin hover:bg-linkedin-hover text-white"
          >
            <Linkedin className="h-5 w-5 mr-2" aria-hidden="true" />
            {t("common.buttons.signInWithLinkedIn")}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FooterCTA;
