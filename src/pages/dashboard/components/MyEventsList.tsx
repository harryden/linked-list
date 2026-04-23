import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MinimalEvent {
  id: string;
  name: string;
  slug: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
}

interface MyEventsListProps {
  events: MinimalEvent[];
  isLoading: boolean;
  title?: string;
}

type EventStatus = "live" | "upcoming" | "draft" | "past";

function getStatus(
  startsAt: string | null,
  endsAt: string | null,
): EventStatus {
  if (!startsAt) return "draft";
  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : start + 8 * 60 * 60 * 1000;
  const now = Date.now();

  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "past";
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
    past: "bg-bg-surface-hover text-text-secondary border-border-subtle",
  };
  return (
    <span
      className={cn(
        "text-[11px] font-medium px-2 py-[3px] rounded-sm border inline-flex items-center gap-1.5 capitalize",
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

const MyEventsList = ({
  events,
  isLoading,
  title = "My events",
}: MyEventsListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-medium">{title}</div>
        {events.length > 0 && (
          <div className="text-[12px] text-text-secondary">
            {events.length} total
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 flex justify-center">
          <div className="w-12 h-0.5 bg-border-subtle rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-8 text-center">
          <p className="text-sm text-text-secondary mb-4">
            {title === "My events" || title === "Upcoming"
              ? "No upcoming events found."
              : "No past events found."}
          </p>
          <Link to="/create-event" state={{ fromDashboard: true }}>
            <Button variant="primary" size="sm">
              Create event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-subtle rounded-xl overflow-hidden">
          {events.map((event, i) => {
            const status = getStatus(event.starts_at, event.ends_at);
            return (
              <Link
                key={event.id}
                to={`/event/${event.slug}`}
                state={{
                  fromDashboard: true,
                }}
                className={cn(
                  "grid gap-4 px-4 py-3.5 items-center hover:bg-bg-surface-hover transition-colors",
                  "grid-cols-[2fr_1.2fr_120px]",
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
                <div className="flex justify-end">
                  <StatusPill status={status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyEventsList;
