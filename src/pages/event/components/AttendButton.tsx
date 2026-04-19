import { Button } from "@/components/ui/button";
import { Linkedin, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttendButtonProps {
  isAttending: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  onAttend: () => void;
  onAuthRedirect: () => void;
}

const AttendButton = ({
  isAttending,
  isLoading,
  isAuthenticated,
  onAttend,
  onAuthRedirect = () => {},
}: AttendButtonProps) => {
  const { t } = useTranslation();

  if (isAttending) {
    return (
      <div className="flex items-center justify-center gap-2 text-success py-3 px-6 bg-success/10 rounded-full border border-success/20 animate-fade-in">
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        <span className="font-semibold text-lg">
          {t("event.header.checkedIn")}
        </span>
      </div>
    );
  }

  const handleClick = () => {
    if (isAuthenticated) {
      onAttend();
    } else {
      onAuthRedirect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isAuthenticated ? "default" : "linkedin"}
      size="xl"
      shape="pill"
      glow={isAuthenticated ? "primary" : "linkedin"}
      className="w-full"
    >
      {!isAuthenticated && (
        <Linkedin className="h-5 w-5 mr-2" aria-hidden="true" />
      )}
      {isLoading
        ? t("event.attendButton.checkingIn")
        : isAuthenticated
          ? t("event.attendButton.checkIn")
          : t("event.attendButton.checkInLinkedIn")}
    </Button>
  );
};

export default AttendButton;
