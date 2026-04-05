import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight } from "lucide-react";
import { TEXT } from "@/constants/text";
import EmptyState from "./EmptyState";

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

const UpcomingSection = ({ events, isLoading }: UpcomingSectionProps) => (
  <section>
    <h2 className="font-display font-black text-2xl tracking-tight mb-4">
      {TEXT.dashboard.upcoming.title}
    </h2>

    {isLoading ? (
      <div className="py-8 text-center text-muted-foreground text-sm">
        {TEXT.dashboard.upcoming.loading}
      </div>
    ) : events.length === 0 ? (
      <EmptyState
        icon={
          <QrCode
            className="h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          />
        }
        title={TEXT.dashboard.upcoming.emptyTitle}
        description={TEXT.dashboard.upcoming.emptyDescription}
        actions={
          <Link to="/join-event" state={{ fromDashboard: true }}>
            <Button>{TEXT.common.buttons.joinFirstEvent}</Button>
          </Link>
        }
      />
    ) : (
      <div className="divide-y divide-border border-y border-border">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.slug}`}
            className="flex items-center justify-between py-3 px-1 hover:bg-accent/30 transition-colors group"
          >
            <div className="flex items-center gap-6 min-w-0">
              <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">
                {event.starts_at
                  ? new Date(event.starts_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : TEXT.common.labels.dateNotSet}
              </span>
              <span className="font-medium truncate">{event.name}</span>
            </div>
            <ArrowRight
              className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    )}
  </section>
);

export default UpcomingSection;
