import React from "react";
import { TEXT } from "@/constants/text";

interface LoadingScreenProps {
  title?: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title,
  message,
}) => {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="text-center w-full max-w-[320px]">
        <div className="w-12 h-0.5 bg-border-subtle rounded-full overflow-hidden mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
        </div>
        {title && (
          <h1 className="text-[20px] font-semibold tracking-[-0.4px]">
            {title}
          </h1>
        )}
        {message && (
          <p className="text-[13px] text-text-secondary mt-2">{message}</p>
        )}
      </div>
    </div>
  );
};
