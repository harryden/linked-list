import { Button } from "@/components/ui/button";
import { Download, Linkedin } from "lucide-react";
import type { AttendanceRecord } from "@/hooks/useAttendances";
import { TEXT } from "@/constants/text";
import { useToast } from "@/hooks/use-toast";
import { exportAttendeesToCSV } from "@/lib/export";
import { cn } from "@/lib/utils";

interface AttendeeListProps {
  attendees: AttendanceRecord[];
  currentUserId: string | null;
  isOrganizer: boolean;
  isLoading: boolean;
  eventName?: string;
}

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
    <div>
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[14px] font-medium">In the room</span>
        <div className="flex items-center gap-2">
          {isOrganizer && attendeeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-auto py-0 px-1 text-[12px] text-text-secondary gap-1"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              {TEXT.event.attendeeList.exportCsv}
            </Button>
          )}
          <span className="text-[12px] text-text-secondary font-mono">
            {attendeeCount}{" "}
            {attendeeCount === 1
              ? TEXT.event.attendeeList.singular
              : TEXT.event.attendeeList.plural}{" "}
            · LIVE
          </span>
        </div>
      </div>
      <p className="text-[12px] text-text-secondary mb-3">
        Updates as people check in.
      </p>

      {isLoading ? (
        <p className="text-[13px] text-text-secondary py-6 text-center">
          {TEXT.event.attendeeList.loading}
        </p>
      ) : attendeeCount === 0 ? (
        <p className="text-[13px] text-text-secondary py-6 text-center">
          {isOrganizer
            ? TEXT.event.attendeeList.organizerEmpty
            : TEXT.event.attendeeList.attendeeEmpty}
        </p>
      ) : (
        <div>
          {attendees.map((record, i) => {
            const profile = record.profiles;
            const name = profile?.name ?? "Unknown";
            const headline = profile?.headline ?? "";
            const initials = name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const joinTime = record.created_at
              ? new Date(record.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "";
            const isSelf = currentUserId === profile?.id;

            return (
              <div
                key={record.id ?? i}
                className={cn(
                  "flex items-center gap-3 py-3",
                  i < attendees.length - 1 && "border-b border-border-subtle",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[11px] font-medium text-text-secondary flex-shrink-0 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      className="w-full h-full object-cover"
                      alt={name}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">
                    {name}
                    {isSelf && (
                      <span className="ml-1.5 text-[11px] font-normal text-text-secondary">
                        (you)
                      </span>
                    )}
                  </div>
                  {headline && (
                    <div className="text-[12px] text-text-secondary truncate">
                      {headline}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label={
                      isSelf
                        ? TEXT.event.header.viewSelfProfile
                        : TEXT.event.header.viewProfile
                    }
                    disabled={!profile?.linkedin_id}
                    onClick={() => {
                      if (profile?.linkedin_id) {
                        window.open(
                          `https://www.linkedin.com/in/${profile.linkedin_id}`,
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
                    <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  {joinTime && (
                    <div className="text-[11px] text-text-secondary font-mono">
                      {joinTime}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendeeList;
