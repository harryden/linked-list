import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { canReloadForChunkError, isChunkLoadError } from "@/lib/chunkReload";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  shouldReload: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    shouldReload: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true, shouldReload: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error)) {
      if (canReloadForChunkError()) {
        this.setState({ hasError: true, shouldReload: true });
        window.location.reload();
      }
      return;
    }

    logger.error(error, {
      category: "UI",
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.shouldReload) {
      return null;
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. We've been notified and are
                looking into it.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleReload}
                variant="default"
                size="lg"
                className="w-full rounded"
              >
                Reload page
              </Button>
              <FeedbackDialog>
                <Button variant="outline" size="lg" className="w-full rounded">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Report what happened
                </Button>
              </FeedbackDialog>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
