import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Linkedin,
  MapPin,
  MoreVertical,
  Pencil,
  QrCode,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import type { EventRow } from "@/hooks/useEvents";
import type { ProfileRow } from "@/hooks/useProfile";
import { TEXT } from "@/constants/text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventHeaderProps {
  event: EventRow;
  eventCode: string;
  organizer?: ProfileRow | null;
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  onShowQr?: () => void;
  variant?: "default" | "compact";
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: EventHeaderProps) => {
  const { toast } = useToast();
  const eventStartDate = useMemo(() => {
    if (!event.starts_at) {
      return null;
    }

    const date = new Date(event.starts_at);

    return Number.isNaN(date.getTime()) ? null : date;
  }, [event.starts_at]);

  const eventEndDate = useMemo(() => {
    if (!event.ends_at) {
      return null;
    }

    const date = new Date(event.ends_at);

    return Number.isNaN(date.getTime()) ? null : date;
  }, [event.ends_at]);

  const dateReference = eventStartDate ?? eventEndDate;

  const formattedEventDate = useMemo(() => {
    if (!dateReference) {
      return TEXT.common.labels.dateNotSet;
    }

    return dateReference.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [dateReference]);

  const timeZoneAbbreviation = useMemo(() => {
    const baseDate = eventStartDate ?? eventEndDate;

    if (!baseDate) {
      return null;
    }

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Stockholm",
      timeZoneName: "short",
    })
      .formatToParts(baseDate)
      .find((part) => part.type === "timeZoneName")?.value;

    if (!parts) {
      return null;
    }

    if (parts.includes("GMT+2") || parts.includes("GMT+02")) {
      return "CEST";
    }

    if (parts.includes("GMT+1") || parts.includes("GMT+01")) {
      return "CET";
    }

    return parts;
  }, [eventStartDate, eventEndDate]);

  const formattedTimeRange = useMemo(() => {
    if (!eventStartDate && !eventEndDate) {
      return TEXT.common.labels.timeNotSet;
    }

    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Stockholm",
    });

    const startTime = eventStartDate ? formatter.format(eventStartDate) : null;
    const endTime = eventEndDate ? formatter.format(eventEndDate) : null;

    const zoneSuffix = timeZoneAbbreviation ? ` ${timeZoneAbbreviation}` : "";

    if (startTime && endTime) {
      return `${startTime} - ${endTime}${zoneSuffix}`;
    }

    const singleTime = startTime ?? endTime;

    return singleTime
      ? `${singleTime}${zoneSuffix}`
      : TEXT.common.labels.timeNotSet;
  }, [eventStartDate, eventEndDate, timeZoneAbbreviation]);

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

  const eventNameLength = event.name?.length ?? 0;

  const eventTitleSizingClass = useMemo(() => {
    if (eventNameLength > 72) {
      return "text-xl sm:text-3xl";
    }

    if (eventNameLength > 56) {
      return "text-[1.2rem] sm:text-[2.05rem]";
    }

    if (eventNameLength > 40) {
      return "text-[1.3rem] sm:text-[2.2rem]";
    }

    if (eventNameLength > 26) {
      return "text-[1.45rem] sm:text-[2.35rem]";
    }

    return "text-[1.55rem] sm:text-[2.4rem]";
  }, [eventNameLength]);

  const isAbnormallyLongTitle = eventNameLength > 88;

  const eventTitleMarginClass = isAttending ? "mb-6" : "mb-4";

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
            {dateReference && (
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedEventDate}</span>
              </div>
            )}
            {(eventStartDate || eventEndDate) && (
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formattedTimeRange}</span>
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
        <div className="grid grid-cols-[1fr_auto_auto] items-start sm:items-center gap-4">
          <CardTitle
            className={cn(
              "min-w-0 break-words leading-tight",
              eventTitleMarginClass,
              eventTitleSizingClass,
              isAbnormallyLongTitle
                ? "truncate sm:truncate-none"
                : "line-clamp-2 sm:line-clamp-none",
            )}
          >
            {event.name}
          </CardTitle>
          {isAttending && (
            <div className="col-start-2 self-start sm:self-center inline-flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-full flex-none shrink-0 translate-x-[0.625rem] sm:translate-x-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {TEXT.event.header.checkedInShort}
              </span>
            </div>
          )}
          {isOrganizer && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-start-3 self-start sm:self-center rounded-full h-10 w-10 flex-none shrink-0 justify-self-end"
                  aria-label={TEXT.event.header.options}
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {onEdit && (
                  <DropdownMenuItem onSelect={() => onEdit()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {TEXT.event.header.edit}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onSelect={() => onDelete()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {TEXT.event.header.delete}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          {eventCode && (
            <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
              <QrCode className="h-4 w-4" />
              <span className="font-mono font-semibold text-foreground">
                {TEXT.common.labels.eventCode}: {eventCode}
              </span>
            </div>
          )}
          {dateReference && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedEventDate}</span>
            </div>
          )}
          {(eventStartDate || eventEndDate) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formattedTimeRange}</span>
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
              <UserAvatar
                src={organizer.avatar_url}
                name={organizer.name}
                className="h-12 w-12"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-0.5">
                  {TEXT.event.header.hostedBy}
                </p>
                <p className="font-semibold text-foreground">
                  {organizer.name}
                </p>
                {organizer.headline && (
                  <p className="text-sm text-muted-foreground truncate">
                    {organizer.headline}
                  </p>
                )}
              </div>
              <Button
                className="flex items-center gap-2 bg-linkedin hover:bg-linkedin-hover text-white py-2 px-4 rounded-full text-xs font-medium transition-all hover:shadow-md"
                onClick={() => {
                  if (organizer.linkedin_id) {
                    window.open(
                      `https://www.linkedin.com/in/${organizer.linkedin_id}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } else {
                    toast({
                      description: TEXT.event.header.linkedInMissing,
                    });
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
