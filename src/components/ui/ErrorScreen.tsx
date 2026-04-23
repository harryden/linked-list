import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backPath?: string;
  backLabel?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again or return home.",
  onRetry,
  backPath = "/",
  backLabel = "Return Home",
}) => {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-[320px] text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-state-error-bg text-state-error mb-6">
          <RefreshCcw className="h-6 w-6" />
        </div>

        <h1 className="text-[24px] font-semibold tracking-[-0.6px] leading-tight text-text-primary">
          {title}
        </h1>

        <p className="text-[14px] text-text-secondary mt-3 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          {onRetry && (
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={onRetry}
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
          )}

          <Button
            asChild
            variant={onRetry ? "ghost" : "primary"}
            size="lg"
            className="w-full gap-2"
          >
            <Link to={backPath}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {backLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
