import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import EventHeader from "@/pages/event/components/EventHeader";
import AttendButton from "@/pages/event/components/AttendButton";
import PageContainer from "@/components/layout/PageContainer";
import { TEXT } from "@/constants/text";
import type { EventRow } from "@/hooks/useEvents";
import type { ProfileRow } from "@/hooks/useProfile";

interface EventUnauthorizedProps {
  event: EventRow;
  eventCode: string;
  organizer?: ProfileRow;
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  onCheckIn: () => void;
  isLoading: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  redirectPath: string;
}

const EventUnauthorized = ({
  event,
  eventCode,
  organizer,
  currentUserId,
  isOrganizer,
  isAttending,
  onCheckIn,
  isLoading,
  onEdit,
  onDelete,
  redirectPath,
}: EventUnauthorizedProps) => (
  <PageContainer maxWidth="sm" className="justify-center">
    <Card className="w-full shadow-2xl">
      <CardContent className="pt-8 pb-6 px-6 space-y-6">
        <EventHeader
          event={event}
          eventCode={eventCode}
          organizer={organizer}
          currentUserId={currentUserId}
          isOrganizer={isOrganizer}
          isAttending={isAttending}
          variant="compact"
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <div className="space-y-4">
          <AttendButton
            currentUserId={currentUserId}
            isOrganizer={isOrganizer}
            isAttending={isAttending}
            onCheckIn={onCheckIn}
            isLoading={isLoading}
            mode="linkedin"
            redirectPath={redirectPath}
          />
          <p className="text-xs text-center text-muted-foreground px-4">
            {TEXT.event.page.guestNotice}
          </p>
        </div>

        {currentUserId && (
          <div className="text-center pt-2">
            <Link
              to="/dashboard"
              className="text-sm text-primary hover:underline"
            >
              {TEXT.common.links.viewPastEvents}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  </PageContainer>
);

export default EventUnauthorized;
