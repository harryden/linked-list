import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEXT } from "@/constants/text";

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
    "w-full h-12 text-base font-medium transition-colors",
    mode === "linkedin"
      ? "bg-linkedin hover:bg-linkedin-hover text-white"
      : "bg-primary text-primary-foreground hover:bg-brand-hover",
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
      {mode === "linkedin" && (
        <Linkedin className="h-5 w-5" aria-hidden="true" />
      )}
      {buttonLabel}
    </Button>
  );

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const motionWrapper = (children: React.ReactNode) => (
    <motion.div
      whileTap={prefersReduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{ display: "contents" }}
    >
      {children}
    </motion.div>
  );

  if (!currentUserId) {
    const safeRedirectPath = redirectPath?.startsWith("/") ? redirectPath : "/";
    const authLink = `/auth?redirect=${encodeURIComponent(safeRedirectPath)}`;

    return motionWrapper(<Link to={authLink}>{button}</Link>);
  }

  return motionWrapper(button);
};

export default AttendButton;
