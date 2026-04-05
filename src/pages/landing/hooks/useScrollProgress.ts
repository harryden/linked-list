import { useState, useEffect, RefObject } from "react";

interface ScrollProgress {
  phaseA: number;
  step: 0 | 1 | 2 | 3;
  showFloatingCTA: boolean;
}

const PHASE_A_VH = 200;
const PHASE_B_VH = 400;

export function useScrollProgress(
  containerRef: RefObject<HTMLDivElement | null>,
): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>({
    phaseA: 0,
    step: 0,
    showFloatingCTA: false,
  });

  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerTop =
        container.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - containerTop;
      const vh = window.innerHeight;

      const phaseAHeight = PHASE_A_VH * (vh / 100);
      const phaseBHeight = PHASE_B_VH * (vh / 100);

      const phaseA = Math.min(Math.max(scrolled / phaseAHeight, 0), 1);

      const phaseBScrolled = scrolled - phaseAHeight;
      const phaseBProgress = Math.min(
        Math.max(phaseBScrolled / phaseBHeight, 0),
        1,
      );

      let step: 0 | 1 | 2 | 3 = 0;
      if (phaseBProgress >= 0.66) step = 3;
      else if (phaseBProgress >= 0.33) step = 2;
      else if (phaseBProgress > 0) step = 1;

      setProgress({
        phaseA,
        step,
        showFloatingCTA: step === 3,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return progress;
}
