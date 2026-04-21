import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 pb-32">
      <div className="max-w-3xl mx-auto text-center border-t border-border-subtle pt-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
          {t("landing.footerCta.title")}
        </h2>
        <p className="text-xl text-text-secondary mb-8">
          {t("landing.footerCta.description")}
        </p>
        <Link to="/auth">
          <Button
            size="lg"
            className="px-6 font-medium bg-linkedin hover:bg-linkedin-hover text-white"
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
