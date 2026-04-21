import { describe, it, expect } from "vitest";

function computeProgress(scrolled: number, vh: number) {
  const phaseAHeight = 200 * (vh / 100);
  const phaseBHeight = 400 * (vh / 100);

  const phaseA = Math.min(Math.max(scrolled / phaseAHeight, 0), 1);
  const phaseBScrolled = scrolled - phaseAHeight;
  const phaseBProgress = Math.min(
    Math.max(phaseBScrolled / phaseBHeight, 0),
    1,
  );

  let step: 0 | 1 | 2 | 3 = 0;
  if (phaseBProgress >= 1) step = 3;
  else if (phaseBProgress >= 0.66) step = 2;
  else if (phaseBProgress >= 0.33) step = 1;

  return { phaseA, step, showFloatingCTA: step === 3 };
}

describe("scroll progress math", () => {
  const vh = 800;

  it("phaseA is 0 at start", () => {
    expect(computeProgress(0, vh).phaseA).toBe(0);
  });

  it("phaseA is 1 at end of phase A", () => {
    expect(computeProgress(200 * (vh / 100), vh).phaseA).toBe(1);
  });

  it("step is 0 before phase B", () => {
    expect(computeProgress(100, vh).step).toBe(0);
  });

  it("step is 0 at start of phase B", () => {
    const phaseBStart = 200 * (vh / 100) + 1;
    expect(computeProgress(phaseBStart, vh).step).toBe(0);
  });

  it("step is 1 at 33% of phase B", () => {
    const at33 = 200 * (vh / 100) + 0.34 * 400 * (vh / 100);
    expect(computeProgress(at33, vh).step).toBe(1);
  });

  it("step is 2 at 66% of phase B", () => {
    const at66 = 200 * (vh / 100) + 0.67 * 400 * (vh / 100);
    expect(computeProgress(at66, vh).step).toBe(2);
  });

  it("step is 3 at 100% of phase B", () => {
    const at100 = 200 * (vh / 100) + 1.0 * 400 * (vh / 100);
    expect(computeProgress(at100, vh).step).toBe(3);
  });

  it("showFloatingCTA is true at step 3", () => {
    const at100 = 200 * (vh / 100) + 1.0 * 400 * (vh / 100);
    expect(computeProgress(at100, vh).showFloatingCTA).toBe(true);
  });
});
