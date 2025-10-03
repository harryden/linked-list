import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, QrCode, Users } from "lucide-react";
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
  onScan: () => void;
}

const UpcomingSection = ({ events, isLoading, onScan }: UpcomingSectionProps) => (
  <section>
    <h2 className="text-2xl font-semibold mb-4">{TEXT.dashboard.upcoming.title}</h2>

    {isLoading ? (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
          <p className="text-muted-foreground">{TEXT.dashboard.upcoming.loading}</p>
        </CardContent>
      </Card>
    ) : events.length === 0 ? (
      <EmptyState
        icon={<QrCode className="h-12 w-12 text-muted-foreground" />}
        title={TEXT.dashboard.upcoming.emptyTitle}
        description={TEXT.dashboard.upcoming.emptyDescription}
        actions={
          <>
            <Button onClick={onScan} className="rounded-full">
              <Camera className="h-4 w-4 mr-2" />
              {TEXT.common.buttons.scanQrCode}
            </Button>
            <Link to="/join-event" state={{ fromDashboard: true }}>
              <Button variant="outline" className="rounded-full">
                {TEXT.common.buttons.joinByCode}
              </Button>
            </Link>
          </>
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
                    : TEXT.common.labels.dateNotSet}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Users className="h-4 w-4" />
                  <span>{TEXT.dashboard.upcoming.viewAttendeeList}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )}
  </section>
);

export default UpcomingSection;
