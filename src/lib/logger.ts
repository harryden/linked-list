/**
 * Structured Logger Abstraction
 *
 * This centralizes all error reporting. Currently, it logs to the console
 * in a structured way, but it is designed to be easily swapped for Sentry
 * or any other monitoring tool.
 */

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  category?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  [key: string]: any;
}

class Logger {
  private isProduction = import.meta.env.PROD;

  /**
   * Report an error to the monitoring service
   */
  error(error: unknown, context: LogContext = {}) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (!this.isProduction) {
      console.group(`[ERROR] ${context.category || "General"}`);
      console.error(message);
      if (stack) console.error(stack);
      if (context.extra) console.dir(context.extra);
      console.groupEnd();
    }

    // TODO: Sentry.captureException(error, { extra: context });
  }

  /**
   * Log a warning
   */
  warn(message: string, context: LogContext = {}) {
    if (!this.isProduction) {
      console.warn(
        `[WARN] ${context.category ? `${context.category}: ` : ""}${message}`,
        context.extra || "",
      );
    }
    // TODO: Sentry.captureMessage(message, "warning");
  }

  /**
   * Log info or a breadcrumb
   */
  info(message: string, context: LogContext = {}) {
    if (!this.isProduction) {
      console.info(
        `[INFO] ${context.category ? `${context.category}: ` : ""}${message}`,
      );
    }
    // TODO: Sentry.addBreadcrumb({ message, category: context.category });
  }
}

export const logger = new Logger();
