import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  as?: ElementType;
  gradient?: boolean;
}

/**
 * Standardized Typography Heading component.
 * Centralizing font sizes and weights makes it easier to change the look of the app globally.
 */
const Heading = ({
  children,
  level = 1,
  className,
  as,
  gradient,
}: HeadingProps) => {
  const Component = as ?? (`h${level}` as ElementType);

  const levelStyles = {
    1: "text-4xl md:text-6xl font-bold tracking-tight",
    2: "text-3xl md:text-4xl font-bold tracking-tight",
    3: "text-2xl md:text-3xl font-semibold tracking-tight",
    4: "text-xl md:text-2xl font-semibold",
    5: "text-lg md:text-xl font-medium",
    6: "text-base md:text-lg font-medium",
  }[level];

  const gradientStyles =
    "bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] bg-clip-text text-transparent";

  return (
    <Component
      className={cn(levelStyles, gradient && gradientStyles, className)}
    >
      {children}
    </Component>
  );
};

export default Heading;
