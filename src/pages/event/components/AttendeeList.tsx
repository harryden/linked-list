import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Linkedin, Users, Download } from "lucide-react";
import type { ProfileRow } from "@/hooks/useProfile";
import type { AttendanceRecord } from "@/hooks/useAttendances";
import { TEXT } from "@/constants/text";
import { useToast } from "@/hooks/use-toast";
import { exportAttendeesToCSV } from "@/lib/export";

interface AttendeeListProps {
  attendees: AttendanceRecord[];
  currentUserId: string | null;
  isOrganizer: boolean;
  isLoading: boolean;
  eventName?: string;
}

interface AttendeeItemProps {
  attendee: ProfileRow;
  currentUserId: string | null;
}

const AttendeeItem = ({ attendee, currentUserId }: AttendeeItemProps) => {
  const isSelf = currentUserId === attendee.id;

  const handleLinkedInClick = () => {
    if (attendee.linkedin_id) {
      window.open(
        `https://www.linkedin.com/in/${attendee.linkedin_id}`,
        "_blank",
      );
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <UserAvatar
        src={attendee.avatar_url}
        name={attendee.name}
        className="h-14 w-14"
        fallbackClassName="text-lg"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{attendee.name}</p>
        {attendee.headline && (
          <p className="text-sm text-muted-foreground truncate">
            {attendee.headline}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLinkedInClick}
          disabled={!attendee.linkedin_id}
          className="rounded-full"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          {isSelf
            ? TEXT.event.header.viewSelfProfile
            : TEXT.event.header.viewProfile}
        </Button>
      </div>
    </div>
  );
};

const AttendeeList = ({
  attendees,
  currentUserId,
  isOrganizer,
  isLoading,
  eventName = "event",
}: AttendeeListProps) => {
  const { toast } = useToast();
  const attendeeCount = attendees.length;

  const handleExport = () => {
    try {
      exportAttendeesToCSV(eventName, attendees);
      toast({
        title: "Success",
        description: TEXT.event.toast.exportSuccess,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: TEXT.event.toast.exportFailure,
      });
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-medium">
            {attendeeCount}{" "}
            {attendeeCount === 1
              ? TEXT.event.attendeeList.singular
              : TEXT.event.attendeeList.plural}
          </span>
        </div>
        {isOrganizer && attendeeCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-full gap-2"
          >
            <Download className="h-4 w-4" />
            {TEXT.event.attendeeList.exportCsv}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">
            {TEXT.event.attendeeList.loading}
          </p>
        ) : attendeeCount === 0 ? (
          <p className="text-center text-muted-foreground py-8 italic">
            {isOrganizer
              ? TEXT.event.attendeeList.organizerEmpty
              : TEXT.event.attendeeList.attendeeEmpty}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {attendees.map((record) => {
              if (!record.profiles) return null;
              return (
                <AttendeeItem
                  key={record.id}
                  attendee={record.profiles}
                  currentUserId={currentUserId}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendeeList;
