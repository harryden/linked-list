import * as Sentry from "@sentry/react";

interface LogContext {
  category?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  [key: string]: unknown;
}

class Logger {
  private isProduction = import.meta.env.PROD;

  error(error: unknown, context: LogContext = {}) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (this.isProduction) {
      Sentry.captureException(
        error instanceof Error ? error : new Error(message),
        {
          tags: { category: context.category, ...context.tags },
          extra: context.extra,
        },
      );
    } else {
      console.group(`[ERROR] ${context.category || "General"}`);
      console.error(message);
      if (stack) console.error(stack);
      if (context.extra) console.dir(context.extra);
      console.groupEnd();
    }
  }

  warn(message: string, context: LogContext = {}) {
    if (this.isProduction) {
      Sentry.captureMessage(message, {
        level: "warning",
        tags: { category: context.category, ...context.tags },
        extra: context.extra,
      });
    } else {
      console.warn(
        `[WARN] ${context.category ? `${context.category}: ` : ""}${message}`,
        context.extra || "",
      );
    }
  }

  info(message: string, context: LogContext = {}) {
    if (this.isProduction) {
      Sentry.captureMessage(message, {
        level: "info",
        tags: { category: context.category, ...context.tags },
      });
    } else {
      console.info(
        `[INFO] ${context.category ? `${context.category}: ` : ""}${message}`,
      );
    }
  }
}

export const logger = new Logger();
