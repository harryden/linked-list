class Analytics {
  identify(_userId: string, _traits?: Record<string, unknown>) {}

  track(_eventName: string, _properties?: Record<string, unknown>) {}

  page(_pageName: string, _properties?: Record<string, unknown>) {}
}

export const analytics = new Analytics();
