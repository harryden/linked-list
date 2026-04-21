import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MinimalEvent {
  id: string;
  name: string;
  slug: string;
  starts_at: string | null;
}

interface UpcomingSectionProps {
  events: MinimalEvent[];
  isLoading: boolean;
}

function formatShortDate(startsAt: string): string {
  const d = new Date(startsAt);
  return d
    .toLocaleString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

const UpcomingSection = ({ events, isLoading }: UpcomingSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-medium">Attending</div>
        {events.length > 0 && (
          <div className="text-[12px] text-text-secondary">
            {events.length} upcoming
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary mx-auto" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 text-center">
          <p className="text-sm text-text-secondary mb-4">
            No upcoming events.
          </p>
          <Link to="/join-event">
            <Button variant="primary" size="sm">
              Join with code
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-subtle rounded-xl overflow-hidden">
          {events.map((event, i) => (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5",
                i < events.length - 1 && "border-b border-border-subtle",
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium">{event.name}</div>
              </div>
              {event.starts_at && (
                <div className="text-[12px] font-mono text-text-secondary tracking-[0.5px] flex-shrink-0">
                  {formatShortDate(event.starts_at)}
                </div>
              )}
              <Link to={`/event/${event.slug}`} className="flex-shrink-0">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingSection;
