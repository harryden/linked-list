import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Linkedin, MapPin, QrCode, Users } from "lucide-react";
import { useMemo } from "react";
import type { EventRow, ProfileRow } from "@/hooks/useSupabaseData";
import { TEXT } from "@/constants/text";
import { toast } from "sonner";

interface EventHeaderProps {
  event: EventRow;
  eventCode: string;
  organizer?: ProfileRow | null;
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  onShowQr?: () => void;
  variant?: "default" | "compact";
}

const EventHeader = ({
  event,
  eventCode,
  organizer,
  currentUserId,
  isOrganizer,
  isAttending,
  onShowQr,
  variant = "default",
}: EventHeaderProps) => {
  const hostInitials = useMemo(() => {
    if (!organizer?.name) {
      return "";
    }

    return organizer.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [organizer?.name]);

  if (variant === "compact") {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
              <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
              <div className="space-y-2 text-muted-foreground">
                {eventCode && (
                  <div className="text-sm text-primary font-medium">
                    {TEXT.common.labels.eventCode}: {eventCode}
                  </div>
                )}
            {event.starts_at && (
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.starts_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
            {organizer && (
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {TEXT.event.header.hostedBy} {organizer.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <CardTitle className="text-4xl mb-2 flex-1 min-w-[200px]">
            {event.name}
          </CardTitle>
          {isAttending && (
            <div className="inline-flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-full">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{TEXT.event.header.checkedIn}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          {eventCode && (
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="font-mono font-semibold text-foreground">
                {TEXT.common.labels.eventCode}: {eventCode}
              </span>
            </div>
          )}
          {event.starts_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(event.starts_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          {organizer && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={organizer.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {hostInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-0.5">
                  {TEXT.event.header.hostedBy}
                </p>
                <p className="font-semibold text-foreground">{organizer.name}</p>
                {organizer.headline && (
                  <p className="text-sm text-muted-foreground truncate">
                    {organizer.headline}
                  </p>
                )}
              </div>
              <Button
                className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white"
                onClick={() => {
                  if (organizer.linkedin_id) {
                    window.open(
                      `https://www.linkedin.com/in/${organizer.linkedin_id}`,
                      "_blank",
                    );
                  } else {
                    toast.info(TEXT.event.header.linkedInMissing);
                  }
                }}
              >
                <Linkedin className="h-4 w-4" />
                {currentUserId === organizer.id
                  ? TEXT.event.header.viewSelfProfile
                  : TEXT.event.header.viewProfile}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isOrganizer && onShowQr && (
        <Button
          onClick={onShowQr}
          size="lg"
          variant="outline"
          className="w-full rounded-full h-12 text-base font-medium"
        >
          <QrCode className="h-5 w-5 mr-2" />
          {TEXT.common.buttons.viewQrCode}
        </Button>
      )}

    </div>
  );
};

export default EventHeader;
