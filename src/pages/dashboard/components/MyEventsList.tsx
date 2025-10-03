import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import EmptyState from "./EmptyState";

interface MinimalEvent {
  id: string;
  name: string;
  slug: string;
  starts_at: string | null;
}

interface MyEventsListProps {
  events: MinimalEvent[];
  isLoading: boolean;
}

const MyEventsList = ({ events, isLoading }: MyEventsListProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Your Events</h2>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
            <p className="text-muted-foreground">Loading your events...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
          title="Ready to host your first event?"
          description="Create your QR in under 10 seconds."
          actions={
            <Link to="/create-event" state={{ fromDashboard: true }}>
              <Button className="rounded-full">Create Your First Event</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Link key={event.id} to={`/event/${event.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    {event.starts_at
                      ? new Date(event.starts_at).toLocaleDateString()
                      : "Date not set"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Users className="h-4 w-4" />
                    <span>View attendees →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyEventsList;
