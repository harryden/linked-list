import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Users } from "lucide-react";
import type { ProfileRow } from "@/hooks/useProfile";
import { TEXT } from "@/constants/text";
import { LINKEDIN } from "@/constants/brands";
import { toast } from "sonner";

interface AttendeeListProps {
  attendees: ProfileRow[];
  currentUserId: string | null;
  isOrganizer: boolean;
  isLoading: boolean;
}

const AttendeeList = ({
  attendees,
  currentUserId,
  isOrganizer,
  isLoading,
}: AttendeeListProps) => {
  const attendeeCount = attendees.length;

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-medium">
            {attendeeCount}{" "}
            {attendeeCount === 1
              ? TEXT.event.attendeeList.singular
              : TEXT.event.attendeeList.plural}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">
            {TEXT.event.attendeeList.loading}
          </p>
        ) : attendeeCount === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {isOrganizer
              ? TEXT.event.attendeeList.organizerEmpty
              : TEXT.event.attendeeList.attendeeEmpty}
          </p>
        ) : (
          <div className="space-y-3">
            {attendees.map((attendee) => {
              const initials = attendee.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={attendee.id}
                  className="flex items-center gap-4 py-4 border-b last:border-0"
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={attendee.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">
                      {attendee.name}
                    </p>
                    {attendee.headline && (
                      <p className="text-sm text-muted-foreground truncate">
                        {attendee.headline}
                      </p>
                    )}
                  </div>
                  <Button
                    className={`flex items-center gap-2 ${LINKEDIN.buttonClass}`}
                    onClick={() => {
                      if (attendee.linkedin_id) {
                        window.open(
                          `https://www.linkedin.com/in/${attendee.linkedin_id}`,
                          "_blank",
                        );
                      } else {
                        toast.info(TEXT.event.header.linkedInMissing);
                      }
                    }}
                  >
                    <Linkedin className="h-4 w-4" />
                    {currentUserId === attendee.id
                      ? TEXT.event.header.viewSelfProfile
                      : TEXT.event.header.viewProfile}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendeeList;
