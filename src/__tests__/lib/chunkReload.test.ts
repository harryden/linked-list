import { isChunkLoadError } from "@/lib/chunkReload";
import { describe, expect, it } from "vitest";

describe("chunk reload detection", () => {
  it("detects browser dynamic import failure messages", () => {
    expect(
      isChunkLoadError(
        new Error(
          "Failed to fetch dynamically imported module: /assets/Auth.js",
        ),
      ),
    ).toBe(true);
    expect(
      isChunkLoadError(new Error("Importing a module script failed")),
    ).toBe(true);
    expect(
      isChunkLoadError(
        new Error("error loading dynamically imported module: /assets/Auth.js"),
      ),
    ).toBe(true);
  });

  it("does not treat unrelated render errors as chunk load errors", () => {
    expect(isChunkLoadError(new Error("Generic component error"))).toBe(false);
  });
});
