import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const PREVIEW_ATTENDEES = [
  { name: "Elena Vasquez", headline: "Design Lead · Ramp", initials: "EV" },
  { name: "Marcus Chen", headline: "Founder · Vellum", initials: "MC" },
  { name: "Priya Sharma", headline: "Principal PM · Stripe", initials: "PS" },
];

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  return (
    <section className="px-16 pt-24 pb-0 max-md:px-4 max-md:pt-16">
      {/* h1 */}
      <h1 className="text-[64px] max-md:text-[36px] font-semibold tracking-[-1.8px] leading-[1.02] mt-6 max-w-[720px]">
        The guest list, rebuilt as a network.
      </h1>

      {/* Body */}
      <p className="text-lg text-text-secondary leading-relaxed mt-5 max-w-[560px]">
        Linked List turns check-ins into contacts. Every attendee leaves with
        the people they actually met — no business cards, no follow-up forms.
      </p>

      {/* CTAs */}
      <div className="flex gap-3 mt-8 max-md:flex-col max-md:max-w-xs">
        <Link to={isAuthenticated ? "/create-event" : "/auth"}>
          <Button
            variant={isAuthenticated ? "primary" : "linkedin"}
            size="lg"
            className="gap-2"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            {isAuthenticated
              ? "Create your first event"
              : "Sign in with LinkedIn"}
          </Button>
        </Link>
        <Link to="/join-event">
          <Button variant="outline" size="lg">
            Join with code
          </Button>
        </Link>
      </div>

      {/* Product preview frame — simplified and non-interactive */}
      <div className="mt-[72px] border border-border-subtle rounded-xl bg-bg-surface p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-4px_rgba(0,0,0,0.05)]">
        <div className="bg-bg-base rounded-lg border border-border-subtle p-7 grid grid-cols-2 gap-10 min-h-[220px] max-md:grid-cols-1 max-md:gap-6">
          {/* Event info */}
          <div>
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.5px]">
              JUL 12 · 18:00
            </div>
            <div className="text-[28px] font-semibold tracking-[-0.6px] mt-2">
              Community Meetup
            </div>
            <div className="text-[13px] text-text-secondary mt-1.5">
              Central Hall · 100 Main St
            </div>
          </div>

          {/* Attendee preview */}
          <div>
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.5px] mb-3">
              CHECKED IN
            </div>
            {PREVIEW_ATTENDEES.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-2.5 py-2 border-b border-border-subtle last:border-0"
              >
                <div className="w-7 h-7 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[10px] font-medium text-text-secondary flex-shrink-0">
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{a.name}</div>
                  <div className="text-[11px] text-text-secondary truncate">
                    {a.headline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
