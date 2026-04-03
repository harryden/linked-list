// Node.js v25 ships a built-in localStorage that is non-functional without
// --localstorage-file. msw's CookieStore calls localStorage.getItem at module
// initialisation, before happy-dom can override globalThis.localStorage.
// This polyfill file runs as the first setupFiles entry so it completes before
// vitest.setup.ts (which imports msw) is loaded.
if (typeof globalThis.localStorage?.getItem !== "function") {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (i: number) => Object.keys(store)[i] ?? null,
    },
    writable: true,
    configurable: true,
  });
}
