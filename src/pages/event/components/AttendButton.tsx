import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn, isSafeRedirect } from "@/lib/utils";
import { TEXT } from "@/constants/text";

interface AttendButtonProps {
  currentUserId: string | null;
  isOrganizer: boolean;
  isAttending: boolean;
  checkedInAt?: string | null;
  onCheckIn: () => void;
  isLoading: boolean;
  className?: string;
  redirectPath?: string;
}

const AttendButton = ({
  currentUserId,
  isOrganizer,
  isAttending,
  checkedInAt,
  onCheckIn,
  isLoading,
  className,
  redirectPath,
}: AttendButtonProps) => {
  const prefersReduced = useReducedMotion();

  if (isOrganizer) return null;

  if (isAttending) {
    const timeStr = checkedInAt
      ? new Date(checkedInAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";

    return (
      <motion.div
        layout
        transition={
          prefersReduced
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 300, damping: 25 }
        }
        className={cn(
          "flex items-center gap-3 bg-state-success-bg border border-state-success rounded-xl px-4 py-[14px]",
          className,
        )}
      >
        <CheckCircle2
          className="h-5 w-5 text-state-success flex-shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <div>
          <div className="text-sm font-medium text-state-success">
            {timeStr ? `Checked in at ${timeStr}` : "Checked in"}
          </div>
          <div className="text-xs text-state-success opacity-80">
            You're on the roster.
          </div>
        </div>
      </motion.div>
    );
  }

  const button = (
    <motion.div
      layout
      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
      transition={
        prefersReduced
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 300, damping: 25 }
      }
      className={cn("w-full", className)}
    >
      <Button
        variant="primary"
        size="xl"
        className="w-full gap-2"
        onClick={currentUserId ? onCheckIn : undefined}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="sr-only">
              {TEXT.event.attendButton.checkingIn}
            </span>
            <div className="w-12 h-0.5 overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            </div>
          </>
        ) : (
          <>
            {currentUserId
              ? TEXT.event.attendButton.checkIn
              : TEXT.event.attendButton.checkInLinkedIn}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </motion.div>
  );

  if (!currentUserId) {
    const safeRedirectPath = isSafeRedirect(redirectPath) ? redirectPath : "/";
    const authLink = `/auth?next=${encodeURIComponent(safeRedirectPath)}`;
    return <Link to={authLink}>{button}</Link>;
  }

  return button;
};

export default AttendButton;
