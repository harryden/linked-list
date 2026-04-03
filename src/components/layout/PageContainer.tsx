import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  withGradient?: boolean;
}

/**
 * Standard container for pages to ensure consistent spacing, max-width, and theme backgrounds.
 * This makes it easy to change the "look" of all pages in one place.
 */
const PageContainer = ({
  children,
  className,
  maxWidth = "lg",
  withGradient = true,
}: PageContainerProps) => {
  const maxWClass = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        withGradient && "bg-gradient-subtle",
      )}
    >
      <main
        className={cn(
          "flex-grow container mx-auto px-4 py-8",
          maxWClass,
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
