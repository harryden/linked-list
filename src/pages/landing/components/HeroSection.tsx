import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, Linkedin } from "lucide-react";
import { TEXT } from "@/constants/text";
import { LINKEDIN } from "@/constants/brands";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => (
  <section className="py-20 md:py-32 text-center">
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        {TEXT.landing.hero.titleLine}
        <br />
        <span
          className="text-primary inline-block animate-fade-in [animation-delay:0.3s] [animation-fill-mode:both] bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] bg-clip-text"
          style={{
            textShadow:
              "0 0 30px rgba(255, 150, 200, 0.9), 0 0 60px rgba(255, 150, 200, 0.7), 0 0 90px rgba(255, 150, 200, 0.5)",
          }}
        >
          {TEXT.landing.hero.highlight}
        </span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {isAuthenticated
          ? TEXT.landing.hero.authenticatedDescription
          : TEXT.landing.hero.guestDescription}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {isAuthenticated ? (
          <>
            <Link to="/join-event">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg"
              >
                <QrCode className="h-5 w-5 mr-2" />
                {TEXT.landing.hero.joinButton}
              </Button>
            </Link>
            <Link to="/create-event">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {TEXT.landing.hero.hostButton}
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button
                size="lg"
                className={`rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg ${LINKEDIN.buttonClass} shadow-[0_0_20px_rgba(${LINKEDIN.blueRgb},0.5)] hover:shadow-[0_0_30px_rgba(${LINKEDIN.blueRgb},0.7)]`}
              >
                <Linkedin className="h-5 w-5 mr-2" />
                {TEXT.landing.hero.signInButton}
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium"
              >
                {TEXT.landing.hero.demoButton}
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  </section>
);

export default HeroSection;
