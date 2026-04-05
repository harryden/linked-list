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
    <section className="py-20 md:py-32 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <Heading level={1}>
          {t("landing.hero.titleLine")}
          <br />
          <Heading
            as="span"
            level={1}
            gradient
            className="inline-block animate-fade-in [animation-delay:0.3s] [animation-fill-mode:both]"
            style={{
              textShadow:
                "0 0 30px hsla(var(--glow-primary) / 0.9), 0 0 60px hsla(var(--glow-primary) / 0.7), 0 0 90px hsla(var(--glow-primary) / 0.5)",
            }}
          >
            {t("landing.hero.highlight")}
          </Heading>
        </Heading>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {isAuthenticated
            ? t("landing.hero.authenticatedDescription")
            : t("landing.hero.guestDescription")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isAuthenticated ? (
            <>
              <Link to="/join-event">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg"
                >
                  <QrCode className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("landing.hero.joinButton")}
                </Button>
              </Link>
              <Link to="/create-event">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 text-base font-medium"
                >
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
                  className="rounded-full px-8 h-12 text-base font-medium transition-all bg-linkedin hover:bg-linkedin-hover text-white shadow-glow-linkedin hover:shadow-lg"
                >
                  <Linkedin className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("landing.hero.signInButton")}
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 text-base font-medium"
                >
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
