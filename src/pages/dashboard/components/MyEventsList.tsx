import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MinimalEvent {
  id: string;
  name: string;
  slug: string;
  starts_at: string | null;
  location: string | null;
}

interface MyEventsListProps {
  events: MinimalEvent[];
  isLoading: boolean;
}

type EventStatus = "live" | "upcoming" | "draft";

function getStatus(startsAt: string | null): EventStatus {
  if (!startsAt) return "draft";
  const start = new Date(startsAt).getTime();
  const now = Date.now();
  if (start <= now && now - start < 8 * 60 * 60 * 1000) return "live";
  return "upcoming";
}

function formatMonoDate(startsAt: string): string {
  const d = new Date(startsAt);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${day} · ${hour}:${min}`;
}

function StatusPill({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, string> = {
    live: "bg-state-success-bg text-state-success border-state-success",
    upcoming: "bg-bg-surface text-text-primary border-border-subtle",
    draft: "bg-bg-surface-hover text-text-secondary border-border-subtle",
  };
  return (
    <span
      className={cn(
        "text-[11px] font-medium px-2 py-[3px] rounded border inline-flex items-center gap-1.5 capitalize",
        styles[status],
      )}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-state-success" />
      )}
      {status}
    </span>
  );
}

const MyEventsList = ({ events, isLoading }: MyEventsListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-medium">My events</div>
        {events.length > 0 && (
          <div className="text-[12px] text-text-secondary">
            {events.length} total
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary mx-auto" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 text-center">
          <p className="text-sm text-text-secondary mb-4">No events found.</p>
          <Link to="/create-event" state={{ fromDashboard: true }}>
            <Button variant="primary" size="sm">
              Create event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-subtle rounded-xl overflow-hidden">
          {events.map((event, i) => {
            const status = getStatus(event.starts_at);
            return (
              <div
                key={event.id}
                className={cn(
                  "grid gap-4 px-4 py-3.5 items-center",
                  "grid-cols-[2fr_1.2fr_1fr_120px]",
                  i < events.length - 1 && "border-b border-border-subtle",
                )}
              >
                <div>
                  <div className="text-[14px] font-medium">{event.name}</div>
                  {event.location && (
                    <div className="text-[12px] text-text-secondary mt-0.5">
                      {event.location}
                    </div>
                  )}
                </div>
                <div className="text-[12px] font-mono text-text-secondary tracking-[0.5px]">
                  {event.starts_at ? formatMonoDate(event.starts_at) : "—"}
                </div>
                <div>
                  <StatusPill status={status} />
                </div>
                <div className="flex gap-1.5 justify-end">
                  <Link to={`/event/${event.slug}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyEventsList;
