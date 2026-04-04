import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = ({
  src,
  name,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const showImage = src && !hasError;

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || "User avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-medium",
            fallbackClassName,
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
