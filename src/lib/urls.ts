export const getBaseUrl = () => {
  let url = "";

  if (typeof window !== "undefined") {
    url = window.location.origin;
  } else if (import.meta.env.VITE_PUBLIC_URL) {
    url = import.meta.env.VITE_PUBLIC_URL;
  }

  return url.replace(/\/$/, "");
};

export const getEventUrl = (slug: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/event/${slug}`;
};

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
