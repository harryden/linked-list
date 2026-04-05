import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import Heading from "@/components/ui/heading";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-36">
      <div className="max-w-4xl space-y-8">
        <Heading level={1}>
          {t("landing.hero.titleLine")}
          <br />
          <span className="text-primary">{t("landing.hero.highlight")}</span>
        </Heading>
        <p className="text-lg text-muted-foreground max-w-xl">
          {isAuthenticated
            ? t("landing.hero.authenticatedDescription")
            : t("landing.hero.guestDescription")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <Link to="/join-event">
                <Button size="lg" className="px-8">
                  <QrCode className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("landing.hero.joinButton")}
                </Button>
              </Link>
              <Link to="/create-event">
                <Button size="lg" variant="outline" className="px-8">
                  <Calendar className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("landing.hero.hostButton")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button
                  size="lg"
                  className="px-8 bg-linkedin hover:bg-linkedin-hover text-white"
                >
                  <Linkedin className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("landing.hero.signInButton")}
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="px-8">
                  {t("landing.hero.demoButton")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
