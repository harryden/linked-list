import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, Linkedin } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => (
  <section className="py-20 md:py-32 text-center">
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        Event Check-In,
        <br />
        <span
          className="text-primary inline-block animate-fade-in [animation-delay:0.3s] [animation-fill-mode:both] bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] bg-clip-text"
          style={{
            textShadow:
              "0 0 30px rgba(255, 150, 200, 0.9), 0 0 60px rgba(255, 150, 200, 0.7), 0 0 90px rgba(255, 150, 200, 0.5)",
          }}
        >
          Simplified.
        </span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {isAuthenticated
          ? "Streamline your event networking with LinkedIn integration. Check in instantly, connect with attendees, and build your professional network effortlessly."
          : "Create a QR code for your event. Attendees scan to check in with LinkedIn. Build verified attendee lists instantly."}
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
                Join an Event
              </Button>
            </Link>
            <Link to="/create-event">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Host an Event
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg bg-[#0A66C2] hover:bg-[#004182] text-white shadow-[0_0_20px_rgba(10,102,194,0.5)] hover:shadow-[0_0_30px_rgba(10,102,194,0.7)]"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                Sign in with LinkedIn
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium"
              >
                How It Works
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  </section>
);

export default HeroSection;
