import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const PREVIEW_ATTENDEES = [
  { name: "Elena Vasquez", headline: "Design Lead · Ramp", initials: "EV" },
  { name: "Marcus Chen", headline: "Founder · Vellum", initials: "MC" },
  { name: "Priya Sharma", headline: "Principal PM · Stripe", initials: "PS" },
  {
    name: "Jordan Okafor",
    headline: "Staff Engineer · Linear",
    initials: "JO",
  },
];

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  return (
    <section className="px-16 pt-24 pb-0 max-md:px-4 max-md:pt-16">
      {/* Eyebrow pill */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-border-subtle rounded-full text-xs text-text-secondary font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-state-success" />
        v2.4 — Check-in codes are live
      </div>

      {/* h1 */}
      <h1 className="text-[64px] max-md:text-[36px] font-semibold tracking-[-1.8px] leading-[1.02] mt-6 max-w-[720px]">
        The guest list, rebuilt as a network.
      </h1>

      {/* Body */}
      <p className="text-lg text-text-secondary leading-relaxed mt-5 max-w-[560px]">
        LinkBack turns check-ins into contacts. Every attendee leaves with the
        people they actually met — no business cards, no follow-up forms.
      </p>

      {/* CTAs */}
      <div className="flex gap-3 mt-8 max-md:flex-col max-md:max-w-xs">
        <Link to={isAuthenticated ? "/create-event" : "/auth"}>
          <Button variant="primary" size="lg" className="gap-2">
            Create your first event
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/join-event">
          <Button variant="outline" size="lg">
            Join with code
          </Button>
        </Link>
      </div>

      {/* Product preview frame */}
      <div className="mt-[72px] border border-border-subtle rounded-xl bg-bg-surface p-2 shadow-lg">
        {/* Browser chrome */}
        <div className="h-7 flex items-center gap-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <span className="flex-1 text-center text-[11px] text-text-secondary font-mono">
            linkback.app/event/ny-founders-oct-24
          </span>
        </div>

        {/* Inner panel — two columns */}
        <div className="bg-bg-base rounded-lg border border-border-subtle p-7 grid grid-cols-2 gap-10 min-h-[220px] max-md:grid-cols-1 max-md:gap-6">
          {/* Event meta */}
          <div>
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.5px]">
              OCT 24 · 19:00
            </div>
            <div className="text-[28px] font-semibold tracking-[-0.6px] mt-2">
              NY Founders Dinner
            </div>
            <div className="text-[13px] text-text-secondary mt-1.5">
              Le Bernardin · 155 W 51st St
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="primary" size="md">
                Check in
              </Button>
              <Button variant="outline" size="md" className="gap-2">
                <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                QR
              </Button>
            </div>
          </div>

          {/* Attendee preview */}
          <div>
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.5px] mb-3">
              24 CHECKED IN
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
