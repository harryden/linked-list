export const getBaseUrl = () => {
  let url = "";

  if (import.meta.env.VITE_PUBLIC_URL) {
    url = import.meta.env.VITE_PUBLIC_URL;
  } else if (typeof window !== "undefined") {
    url = window.location.origin;
  }

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
export const getProductionUrl = () => {
  const url =
    import.meta.env.VITE_PUBLIC_URL || "https://linked-list-nine.vercel.app";
  return url.replace(/\/$/, "");
};
