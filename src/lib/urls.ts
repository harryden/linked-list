export const getBaseUrl = () => {
  // Fallback to environment variable if window is not defined, otherwise use current origin
  const url =
    (typeof window !== "undefined" ? window.location.origin : "") ||
    import.meta.env.VITE_PUBLIC_URL ||
    "";

  // Trim trailing slash to avoid double slashes when joining paths
  return url.replace(/\/$/, "");
};

export const getEventUrl = (slug: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/event/${slug}`;
};

/**
 * Returns the stable production URL.
 * Used for OAuth redirects since LinkedIn requires a pre-registered stable domain.
 */
export const getProductionUrl = (isProd = import.meta.env.PROD) => {
  const url = import.meta.env.VITE_PUBLIC_URL;

  if (!url) {
    if (isProd) {
      throw new Error(
        "VITE_PUBLIC_URL environment variable is required in production",
      );
    }
    return "http://localhost:8080";
  }

  return url.replace(/\/$/, "");
};
