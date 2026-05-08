export const CHUNK_ERROR_RELOAD_KEY = "last-chunk-error-reload";

const CHUNK_ERROR_RELOAD_WINDOW_MS = 10000;

export const isChunkLoadError = (error: Error) =>
  error.name === "ChunkLoadError" ||
  error.message.includes("Failed to fetch dynamically imported module") ||
  error.message.includes("Importing a module script failed") ||
  error.message.includes("error loading dynamically imported module");

export const canReloadForChunkError = () => {
  try {
    const lastReload = sessionStorage.getItem(CHUNK_ERROR_RELOAD_KEY);
    const lastReloadAt = lastReload ? Number.parseInt(lastReload, 10) : null;
    const now = Date.now();

    if (
      !lastReloadAt ||
      Number.isNaN(lastReloadAt) ||
      now - lastReloadAt > CHUNK_ERROR_RELOAD_WINDOW_MS
    ) {
      sessionStorage.setItem(CHUNK_ERROR_RELOAD_KEY, now.toString());
      return true;
    }
  } catch {
    return false;
  }

  return false;
};
