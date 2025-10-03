import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendButtonProps {
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  onCheckIn: () => void;
  isLoading: boolean;
  mode?: "primary" | "linkedin";
  className?: string;
}

const AttendButton = ({
  currentUserId,
  isOrganizer,
  isAttending,
  onCheckIn,
  isLoading,
  mode = "primary",
  className,
}: AttendButtonProps) => {
  if (isOrganizer || isAttending) {
    return null;
  }

  const buttonClasses = cn(
    "w-full rounded-full h-12 text-base font-medium",
    mode === "linkedin"
      ? "flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white"
      : "",
    className,
  );

  const buttonLabel = mode === "linkedin"
    ? isLoading
      ? "Checking In..."
      : "Check In with LinkedIn"
    : isLoading
    ? "Checking In..."
    : "Check In to This Event";

  const button = (
    <Button
      onClick={currentUserId ? onCheckIn : undefined}
      className={buttonClasses}
      disabled={isLoading}
    >
      {mode === "linkedin" && <Linkedin className="h-5 w-5" />}
      {buttonLabel}
    </Button>
  );

  if (!currentUserId) {
    return <Link to="/auth">{button}</Link>;
  }

  return button;
};

export default AttendButton;
