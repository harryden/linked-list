class Analytics {
  private isProduction = import.meta.env.PROD;

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isProduction) {
      console.log(`[Analytics] Identify User: ${userId}`, traits || "");
    }
    // TODO: mixpanel.identify(userId) or posthog.identify(userId)
  }

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isProduction) {
      console.log(`[Analytics] Track Event: ${eventName}`, properties || "");
    }
    // TODO: mixpanel.track(eventName, properties) or posthog.capture(eventName, properties)
  }

  page(pageName: string, properties?: Record<string, any>) {
    if (!this.isProduction) {
      console.log(`[Analytics] Page View: ${pageName}`, properties || "");
    }
  }
}

export const analytics = new Analytics();
