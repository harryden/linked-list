import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEXT } from "@/constants/text";
import { LINKEDIN } from "@/constants/brands";

interface AttendButtonProps {
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  onCheckIn: () => void;
  isLoading: boolean;
  mode?: "primary" | "linkedin";
  className?: string;
  redirectPath?: string;
}

const AttendButton = ({
  currentUserId,
  isOrganizer,
  isAttending,
  onCheckIn,
  isLoading,
  mode = "primary",
  className,
  redirectPath,
}: AttendButtonProps) => {
  if (isOrganizer || isAttending) {
    return null;
  }

  const buttonClasses = cn(
    "w-full rounded-full h-12 text-base font-medium transition-all hover:shadow-lg",
    mode === "linkedin"
      ? "bg-linkedin hover:bg-linkedin-hover text-white shadow-glow-linkedin"
      : "bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary-hover",
    className,
  );

  const buttonLabel =
    mode === "linkedin"
      ? isLoading
        ? TEXT.event.attendButton.checkingIn
        : TEXT.event.attendButton.checkInLinkedIn
      : isLoading
        ? TEXT.event.attendButton.checkingIn
        : TEXT.event.attendButton.checkIn;

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
    const safeRedirectPath = redirectPath?.startsWith("/") ? redirectPath : "/";
    const authLink = `/auth?redirect=${encodeURIComponent(safeRedirectPath)}`;

    return <Link to={authLink}>{button}</Link>;
  }

  return button;
};

export default AttendButton;
