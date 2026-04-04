type LogLevel = "info" | "warn" | "error";

interface LogContext {
  category?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  [key: string]: any;
}

class Logger {
  private isProduction = import.meta.env.PROD;

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
  }

  warn(message: string, context: LogContext = {}) {
    if (!this.isProduction) {
      console.warn(
        `[WARN] ${context.category ? `${context.category}: ` : ""}${message}`,
        context.extra || "",
      );
    }
  }

  info(message: string, context: LogContext = {}) {
    if (!this.isProduction) {
      console.info(
        `[INFO] ${context.category ? `${context.category}: ` : ""}${message}`,
      );
    }
  }
}

export const logger = new Logger();
