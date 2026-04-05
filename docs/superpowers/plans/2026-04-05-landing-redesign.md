# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Landing page with a cinematic scroll-driven experience: animated ShaderGradient background, ghost-outline headline, hand+phone PNG that peeks from bottom and slides up, phone screen that reveals 4 content steps as the user scrolls, floating CTA to the left of the phone at the end, followed by a How It Works section and a gradient CTA footer.

**Architecture:** The Landing page is broken into isolated components, each responsible for one visual zone. A single `useScrollProgress` hook owns all scroll math and feeds progress values down to components as props. Lenis wraps the app at root level for smooth scroll. The ShaderGradient canvas is `position: fixed` behind everything. The hand+phone PNG and the screen overlay are separated from the slide-up animation wrapper to avoid stacking context issues with `mix-blend-mode`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lenis (`lenis`), ShaderGradient (`shader-gradient`), Plus Jakarta Sans (Google Fonts), existing `QRCodePreview` component, existing i18n keys.

---

## File Map

| File                                                  | Action           | Responsibility                                                 |
| ----------------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `index.html`                                          | Modify           | Add Plus Jakarta Sans Google Fonts link                        |
| `src/main.tsx`                                        | Modify           | Wrap app with Lenis provider                                   |
| `src/pages/Landing.tsx`                               | Rewrite          | Top-level layout: gradient canvas + nav + three acts           |
| `src/pages/landing/components/GradientBackground.tsx` | Create           | Fixed ShaderGradient canvas, z-index 0                         |
| `src/pages/landing/components/LandingNav.tsx`         | Create           | Transparent sticky nav, frosted glass sign-in pill             |
| `src/pages/landing/components/HeroSection.tsx`        | Rewrite          | Ghost headline + scroll zone container (600vh)                 |
| `src/pages/landing/components/PhoneReveal.tsx`        | Create           | Slide-up wrapper + color cast layer                            |
| `src/pages/landing/components/PhoneScreen.tsx`        | Create           | Overlay div with status bar + 4 screen steps                   |
| `src/pages/landing/components/PhoneStatusBar.tsx`     | Create           | Dynamic Island + live clock + wifi/battery SVGs                |
| `src/pages/landing/components/PhoneScreenStep.tsx`    | Create           | Individual screen step (QR / attendee list / CTA)              |
| `src/pages/landing/components/FloatingCTA.tsx`        | Create           | Left-side CTA that appears at scroll step 4                    |
| `src/pages/landing/components/HowItWorks.tsx`         | Rewrite          | Dark section, ghost step numbers, IntersectionObserver reveals |
| `src/pages/landing/components/FooterCTA.tsx`          | Rewrite          | Static CSS gradient, LinkedIn sign-in button                   |
| `src/pages/landing/hooks/useScrollProgress.ts`        | Create           | All scroll math: Phase A progress, Phase B step index          |
| `src/assets/phone-hand.png`                           | Add (gitignored) | Transparent PNG of hand holding phone                          |
| `tailwind.config.ts`                                  | Modify           | Add `color-cast` keyframe animation                            |
| `.gitignore`                                          | Modify           | Add `src/assets/phone-hand.png`                                |

---

## Task 1: Install dependencies and add font

**Files:**

- Modify: `package.json` (via npm)
- Modify: `index.html`

- [ ] **Step 1: Install Lenis and ShaderGradient**

```bash
npm install lenis @shader-gradient/react
```

Expected output: both packages appear in `node_modules` and `package.json` dependencies.

- [ ] **Step 2: Add Plus Jakarta Sans to index.html**

In `index.html`, add inside `<head>` before the closing tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: Add phone-hand.png to .gitignore**

Add to `.gitignore`:

```
# Placeholder asset — replace with licensed image before publishing
src/assets/phone-hand.png
```

- [ ] **Step 4: Place the asset**

Copy the transparent PNG to `src/assets/phone-hand.png`.

- [ ] **Step 5: Commit**

```bash
git add index.html .gitignore package.json package-lock.json
git commit -m "Install Lenis, ShaderGradient, add Plus Jakarta Sans font"
```

---

## Task 2: Wrap app with Lenis smooth scroll

**Files:**

- Modify: `src/main.tsx`

Lenis must wrap at root level so smooth scroll applies to all pages. It emits a `scroll` event that `useScrollProgress` will consume.

- [ ] **Step 1: Update main.tsx**

Replace the contents of `src/main.tsx` with:

```tsx
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { logger } from "@/lib/logger";

window.addEventListener("unhandledrejection", (event) => {
  logger.error(event.reason, { category: "GlobalUnhandledRejection" });
});

window.addEventListener("error", (event) => {
  logger.error(event.error, { category: "GlobalError" });
});

if (location.pathname.startsWith("/event/")) {
  import("./pages/EventPage").catch(() => {});
}

const lenis = new Lenis();

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById("root")!).render(<App />);
```

- [ ] **Step 2: Verify app still loads**

```bash
npm run dev
```

Navigate to `http://localhost:5173`. The page should load with noticeably smoother scroll inertia. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "Add Lenis smooth scroll at app root"
```

---

## Task 3: Add color-cast keyframe to Tailwind config

**Files:**

- Modify: `tailwind.config.ts`

This keyframe is used by the `PhoneReveal` component's color cast layer.

- [ ] **Step 1: Add keyframe and animation to tailwind.config.ts**

In `tailwind.config.ts`, inside `theme.extend.keyframes`, add:

```ts
"color-cast": {
  "0%, 100%": { background: "rgba(86, 6, 255, 0.3)" },
  "40%":       { background: "rgba(254, 137, 137, 0.3)" },
  "70%":       { background: "rgba(0, 0, 0, 0.15)" },
},
"scroll-pulse": {
  "0%, 100%": { opacity: "0.25" },
  "50%":       { opacity: "1" },
},
```

In `theme.extend.animation`, add:

```ts
"color-cast":   "color-cast 8s ease-in-out infinite",
"scroll-pulse": "scroll-pulse 1.5s ease-in-out infinite",
```

In `theme.extend`, also add a `fontFamily` block so Plus Jakarta Sans becomes the
global default sans-serif (picks up in all Tailwind `font-sans` consumers, including
the globally-mounted `FeedbackDialog` trigger button in `App.tsx`):

```ts
fontFamily: {
  sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
},
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "Add color-cast, scroll-pulse keyframes and set Plus Jakarta Sans as global font"
```

---

## Task 4: GradientBackground component

**Files:**

- Create: `src/pages/landing/components/GradientBackground.tsx`

Fixed canvas, z-index 0, behind everything. All page content sits above it via `position: relative; z-index: 1`.

- [ ] **Step 1: Create the component**

```tsx
import { ShaderGradientCanvas, ShaderGradient } from "@shader-gradient/react";

const GradientBackground = () => (
  <div className="fixed inset-0 z-0" aria-hidden="true">
    <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
      <ShaderGradient
        animate="on"
        type="waterPlane"
        uSpeed={0.2}
        uStrength={2.4}
        uDensity={0.7}
        color1="#5606ff"
        color2="#fe8989"
        color3="#000000"
        cDistance={3.91}
        cPolarAngle={115}
        cAzimuthAngle={180}
        rotationZ={235}
        brightness={1.1}
        grain="off"
        lightType="3d"
        envPreset="city"
        reflection={0.1}
      />
    </ShaderGradientCanvas>
  </div>
);

export default GradientBackground;
```

- [ ] **Step 2: Verify in browser**

Temporarily import and render `<GradientBackground />` at the top of `src/pages/Landing.tsx` (inside the return), navigate to `/`. You should see the animated purple-pink-black gradient filling the screen. Remove the temporary import after verifying.

- [ ] **Step 3: Commit**

```bash
git add src/pages/landing/components/GradientBackground.tsx
git commit -m "Add fixed ShaderGradient background component"
```

---

## Task 5: useScrollProgress hook

**Files:**

- Create: `src/pages/landing/hooks/useScrollProgress.ts`

This hook owns all scroll math for the hero zone. It returns:

- `phaseA`: `0–1`, how far through the phone slide-up we are
- `step`: `0 | 1 | 2 | 3`, which phone screen step is active (0 = blank, 1 = QR, 2 = attendees, 3 = CTA)
- `showFloatingCTA`: `boolean`, true when step === 3

The hero scroll zone is 600vh. Phase A is the first 200vh (phone slides up). Phase B is the remaining 400vh (screen reveals). The hook receives the scroll zone container ref so it can calculate offsets correctly.

- [ ] **Step 1: Create the hook**

```ts
import { useState, useEffect, useRef, RefObject } from "react";

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
```

- [ ] **Step 2: Write a unit test**

Create `src/__tests__/hooks/useScrollProgress.test.ts`:

```ts
import { describe, it, expect } from "vitest";

// Pure math extracted from hook for unit testing
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
  if (phaseBProgress >= 0.66) step = 3;
  else if (phaseBProgress >= 0.33) step = 2;
  else if (phaseBProgress > 0) step = 1;

  return { phaseA, step, showFloatingCTA: step === 3 };
}

describe("scroll progress math", () => {
  const vh = 800; // 800px viewport height

  it("phaseA is 0 at start", () => {
    expect(computeProgress(0, vh).phaseA).toBe(0);
  });

  it("phaseA is 1 at end of phase A", () => {
    expect(computeProgress(200 * (vh / 100), vh).phaseA).toBe(1);
  });

  it("step is 0 before phase B", () => {
    expect(computeProgress(100, vh).step).toBe(0);
  });

  it("step is 1 at start of phase B", () => {
    const phaseBStart = 200 * (vh / 100) + 1;
    expect(computeProgress(phaseBStart, vh).step).toBe(1);
  });

  it("step is 2 at 33% of phase B", () => {
    const at33 = 200 * (vh / 100) + 0.34 * 400 * (vh / 100);
    expect(computeProgress(at33, vh).step).toBe(2);
  });

  it("step is 3 at 66% of phase B", () => {
    const at66 = 200 * (vh / 100) + 0.67 * 400 * (vh / 100);
    expect(computeProgress(at66, vh).step).toBe(3);
  });

  it("showFloatingCTA is true at step 3", () => {
    const at66 = 200 * (vh / 100) + 0.67 * 400 * (vh / 100);
    expect(computeProgress(at66, vh).showFloatingCTA).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test -- useScrollProgress
```

Expected: 7 passing tests.

- [ ] **Step 4: Commit**

```bash
git add src/pages/landing/hooks/useScrollProgress.ts src/__tests__/hooks/useScrollProgress.test.ts
git commit -m "Add useScrollProgress hook with scroll math unit tests"
```

---

## Task 6: PhoneStatusBar component

**Files:**

- Create: `src/pages/landing/components/PhoneStatusBar.tsx`

Always-visible strip at top of phone screen. Live clock, Dynamic Island pill, wifi + battery icons. Dark text on white.

- [ ] **Step 1: Create the component**

```tsx
import { useState, useEffect } from "react";

const WifiIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
  </svg>
);

const BatteryIcon = () => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 24 14"
    fill="none"
    stroke="#111"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <rect x="1" y="1" width="18" height="12" rx="2" />
    <path d="M21 5v4" strokeWidth="2.5" />
    <rect x="3" y="3" width="12" height="8" rx="1" fill="#111" stroke="none" />
  </svg>
);

const SignalIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="#111">
    <rect x="1" y="14" width="4" height="9" rx="1" />
    <rect x="7" y="10" width="4" height="13" rx="1" />
    <rect x="13" y="6" width="4" height="17" rx="1" />
    <rect x="19" y="2" width="4" height="21" rx="1" />
  </svg>
);

const PhoneStatusBar = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      );
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px 0",
        background: "#fff",
        position: "relative",
        flexShrink: 0,
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 600,
          color: "#111",
          letterSpacing: "-0.01em",
        }}
      >
        {time}
      </span>

      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 6,
          width: 44,
          height: 12,
          background: "#000",
          borderRadius: 10,
        }}
      />

      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
};

export default PhoneStatusBar;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/PhoneStatusBar.tsx
git commit -m "Add PhoneStatusBar with live clock and Dynamic Island"
```

---

## Task 7: PhoneScreenStep components

**Files:**

- Create: `src/pages/landing/components/PhoneScreen.tsx`

Contains the status bar + the 4 screen steps. Steps cross-fade based on the `step` prop (0–3). The overlay is positioned absolutely over the phone screen area and uses iOS system font throughout.

- [ ] **Step 1: Create PhoneScreen.tsx**

```tsx
import PhoneStatusBar from "./PhoneStatusBar";
import QRCodePreview from "@/components/QRCodePreview";

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

const ATTENDEES = [
  {
    name: "Alex Johnson",
    role: "Product Designer · Spotify",
    color: "linear-gradient(135deg,#5606ff,#fe8989)",
  },
  {
    name: "Maria Chen",
    role: "Engineering Lead · Figma",
    color: "linear-gradient(135deg,#0a66c2,#38bdf8)",
  },
  {
    name: "Sam Rivera",
    role: "Founder · Seed stage",
    color: "linear-gradient(135deg,#fe8989,#ff6b6b)",
  },
];

const StepBlank = () => <div style={{ flex: 1, background: "#fff" }} />;

const StepQR = () => (
  <div
    style={{
      flex: 1,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "12px 16px",
      fontFamily: IOS_FONT,
    }}
  >
    <span
      style={{
        fontSize: 8,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#999",
        alignSelf: "flex-start",
      }}
    >
      Check in
    </span>
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 10,
        padding: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <QRCodePreview
        value="https://linkback.app/auth"
        size={90}
        className="!p-0 !shadow-none !rounded-none !bg-transparent"
        imageClassName="!h-[90px] !w-[90px]"
      />
    </div>
    <span style={{ fontSize: 9.5, fontWeight: 700, color: "#111" }}>
      Scan to sign in
    </span>
    <span style={{ fontSize: 8, color: "#aaa" }}>linkback.app/auth</span>
  </div>
);

const StepAttendees = () => (
  <div
    style={{
      flex: 1,
      background: "#f7f7f8",
      display: "flex",
      flexDirection: "column",
      fontFamily: IOS_FONT,
      overflowY: "hidden",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "8px 12px 6px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 800,
          color: "#111",
          letterSpacing: "-0.02em",
        }}
      >
        Stockholm Tech Meetup
      </div>
      <div style={{ fontSize: 7.5, color: "#999" }}>
        Tue 6 May · Stureplan 4
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#111",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        24
      </span>
      <span style={{ fontSize: 8, color: "#aaa", lineHeight: 1.2 }}>
        checked
        <br />
        in
      </span>
    </div>
    <div
      style={{
        fontSize: 7.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#aaa",
        padding: "0 12px 4px",
      }}
    >
      Attendees
    </div>
    {ATTENDEES.map(({ name, role, color }) => (
      <div
        key={name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px",
          background: "#fff",
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 700,
              color: "#111",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 7,
              color: "#aaa",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {role}
          </div>
        </div>
        <div
          style={{
            width: 14,
            height: 14,
            background: "#0a66c2",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 6,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          in
        </div>
      </div>
    ))}
    <div style={{ padding: "5px 12px", fontSize: 7.5, color: "#ccc" }}>
      +21 more attendees
    </div>
  </div>
);

const StepCTA = () => (
  <div
    style={{
      flex: 1,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 16,
      fontFamily: IOS_FONT,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#111",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: "-0.03em",
      }}
    >
      Host smarter
      <br />
      events.
    </div>
    <div
      style={{
        fontSize: 8.5,
        color: "#999",
        textAlign: "center",
        lineHeight: 1.5,
        maxWidth: 110,
      }}
    >
      LinkedIn-verified check-ins. Real profiles. No fake attendees.
    </div>
    <div
      style={{
        background: "linear-gradient(135deg,#5606ff,#8b35ff)",
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        padding: "8px 18px",
        borderRadius: 24,
        letterSpacing: "-0.01em",
        boxShadow: "0 4px 16px rgba(86,6,255,0.4)",
      }}
    >
      Get started free
    </div>
    <div
      style={{
        fontSize: 8,
        color: "#bbb",
        textDecoration: "underline",
        textUnderlineOffset: 2,
      }}
    >
      See how it works →
    </div>
  </div>
);

const STEPS = [StepBlank, StepQR, StepAttendees, StepCTA];

interface PhoneScreenProps {
  step: 0 | 1 | 2 | 3;
}

const PhoneScreen = ({ step }: PhoneScreenProps) => {
  const StepComponent = STEPS[step];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 30,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <PhoneStatusBar />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {STEPS.map((Step, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              opacity: i === step ? 1 : 0,
              transition: "opacity 400ms ease",
              pointerEvents: i === step ? "auto" : "none",
            }}
          >
            <Step />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/PhoneScreen.tsx
git commit -m "Add PhoneScreen component with 4 scroll-driven screen steps"
```

---

## Task 8: PhoneReveal component

**Files:**

- Create: `src/pages/landing/components/PhoneReveal.tsx`

**Critical stacking context note:** The slide-up translation is applied on an outer wrapper `div`. The inner `phone-container` div (which holds the PNG and the color-cast overlay) must NOT have `transform`, `opacity < 1`, or `filter` applied to it — those would create a new stacking context and break `mix-blend-mode: overlay` on the color cast layer. Only the outer wrapper gets `translateY`.

- [ ] **Step 1: Create PhoneReveal.tsx**

```tsx
import phoneHandImg from "@/assets/phone-hand.png";
import PhoneScreen from "./PhoneScreen";

interface PhoneRevealProps {
  phaseA: number; // 0–1: how far through slide-up
  step: 0 | 1 | 2 | 3;
}

// The phone screen area within the image.
// These values must be calibrated to the actual phone-hand.png dimensions.
// After placing the image, measure the screen top/left/width/height as percentages
// of the total image dimensions and update these constants.
const SCREEN_INSET = {
  top: "12%",
  left: "18%",
  width: "64%",
  height: "72%",
};

const PhoneReveal = ({ phaseA, step }: PhoneRevealProps) => {
  // Phase A: translate from +60vh (peeking from bottom) to 0 (fully visible)
  // At phaseA=0: translateY = 60vh (only top of phone visible above fold)
  // At phaseA=1: translateY = 0 (full image visible, locked)
  const translateY = (1 - phaseA) * 60;

  return (
    // Outer wrapper: gets the slide-up transform. No blend mode here.
    <div
      style={{
        position: "absolute",
        right: "5%",
        bottom: 0,
        width: "42vw",
        maxWidth: 480,
        transform: `translateY(${translateY}vh)`,
        transition: "none", // driven by scroll, not CSS transition
      }}
    >
      {/* Inner container: NO transform/opacity/filter — preserves blend mode context */}
      <div style={{ position: "relative" }}>
        {/* The hand + phone PNG */}
        <img
          src={phoneHandImg}
          alt=""
          aria-hidden="true"
          style={{ width: "100%", display: "block" }}
        />

        {/* Color cast layer — mix-blend-mode: overlay */}
        {/* Covers the entire image. Blends gradient colors into hand shadows. */}
        {/* The outer wrapper must NOT have transform/opacity/filter for this to work. */}
        <div
          className="animate-color-cast"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />

        {/* Phone screen overlay — sits over the blank screen area of the PNG */}
        {/* Opacity tied to phaseA: screen only appears once phone is fully visible */}
        <div
          style={{
            position: "absolute",
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            width: SCREEN_INSET.width,
            height: SCREEN_INSET.height,
            opacity: phaseA,
            transition: "opacity 300ms ease",
            borderRadius: "4% / 2.5%",
            overflow: "hidden",
          }}
        >
          <PhoneScreen step={step} />
        </div>
      </div>
    </div>
  );
};

export default PhoneReveal;
```

- [ ] **Step 2: Calibrate SCREEN_INSET**

After placing `phone-hand.png`, open the browser, inspect the image, and measure the pixel coordinates of the top-left corner and bottom-right corner of the blank white screen area. Convert to percentages of the image's total width/height and update `SCREEN_INSET` in `PhoneReveal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/landing/components/PhoneReveal.tsx
git commit -m "Add PhoneReveal: slide-up animation with color cast glow and screen overlay"
```

---

## Task 9: FloatingCTA component

**Files:**

- Create: `src/pages/landing/components/FloatingCTA.tsx`

Appears to the left of the phone when `step === 3`. Uses ghost headline style matching the hero. LinkedIn sign-in triggers the existing `/auth` route.

- [ ] **Step 1: Create FloatingCTA.tsx**

```tsx
import { Link } from "react-router-dom";

interface FloatingCTAProps {
  visible: boolean;
}

const FloatingCTA = ({ visible }: FloatingCTAProps) => (
  <div
    style={{
      position: "absolute",
      left: "5%",
      top: "50%",
      transform: `translateY(-50%) translateX(${visible ? "0" : "-20px"})`,
      opacity: visible ? 1 : 0,
      transition: "opacity 600ms ease, transform 600ms ease",
      pointerEvents: visible ? "auto" : "none",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 340,
    }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        fontFamily: "var(--font-brand)",
      }}
    >
      LinkBack
    </span>

    {/* Ghost outline headline */}
    <div
      style={{
        fontFamily: "var(--font-brand)",
        lineHeight: 0.92,
        letterSpacing: "-0.05em",
      }}
    >
      <div
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 900,
          color: "#fff",
        }}
      >
        Check in.
      </div>
      <div
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.6)",
        }}
      >
        Stand out.
      </div>
    </div>

    <p
      style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.6,
        fontFamily: "var(--font-brand)",
      }}
    >
      LinkedIn-verified attendance for events that matter.
    </p>

    <Link to="/auth" style={{ textDecoration: "none" }}>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          color: "#111",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px 22px",
          borderRadius: 28,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-brand)",
          letterSpacing: "-0.01em",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            background: "#0a66c2",
            borderRadius: 4,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          in
        </span>
        Sign in with LinkedIn
      </button>
    </Link>

    <Link
      to="/demo"
      style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-brand)",
        textDecoration: "underline",
        textUnderlineOffset: 3,
      }}
    >
      See how it works →
    </Link>
  </div>
);

export default FloatingCTA;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/FloatingCTA.tsx
git commit -m "Add FloatingCTA component: appears left of phone at scroll step 3"
```

---

## Task 10: LandingNav component

**Files:**

- Create: `src/pages/landing/components/LandingNav.tsx`

Extracts nav from `Landing.tsx`. Transparent background, white text, frosted glass sign-in pill. Auth state logic moved here from `Landing.tsx`.

- [ ] **Step 1: Create LandingNav.tsx**

```tsx
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";
import linkbackLogo from "@/assets/linkback-logo.png";

interface LandingNavProps {
  user: User | null;
  onSignOut: () => void;
}

const LandingNav = ({ user, onSignOut }: LandingNavProps) => {
  const { t } = useTranslation();

  return (
    <header
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
      className="px-6 py-3 flex items-center justify-between"
    >
      <img
        src={linkbackLogo}
        alt="LinkBack"
        className="h-12 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/dashboard">
              <button
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  borderRadius: 24,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {t("common.buttons.myEvents")}
              </button>
            </Link>
            <button
              onClick={onSignOut}
              aria-label={t("common.buttons.signOut")}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <Link to="/auth">
            <button
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                borderRadius: 24,
                padding: "8px 18px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-brand)",
              }}
            >
              {t("common.buttons.signInWithLinkedIn")}
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default LandingNav;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/LandingNav.tsx
git commit -m "Add transparent LandingNav with frosted glass sign-in pill"
```

---

## Task 11: HeroSection — ghost headline + scroll zone

**Files:**

- Rewrite: `src/pages/landing/components/HeroSection.tsx`

600vh tall scroll zone. Sticky inner panel. Ghost headline on left. PhoneReveal on right. FloatingCTA on left at step 3. Scroll indicator fades on first scroll.

- [ ] **Step 1: Rewrite HeroSection.tsx**

```tsx
import { useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";
import PhoneReveal from "./PhoneReveal";
import FloatingCTA from "./FloatingCTA";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phaseA, step, showFloatingCTA } = useScrollProgress(containerRef);

  return (
    // Scroll zone: 600vh tall. The sticky child does all the visual work.
    <div ref={containerRef} style={{ height: "600vh", position: "relative" }}>
      {/* Sticky viewport panel */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Ghost headline — visible from page load, fades out when floating CTA appears */}
        <div
          style={{
            position: "absolute",
            left: "5%",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: showFloatingCTA ? 0 : 1,
            transition: "opacity 600ms ease",
            zIndex: 2,
            fontFamily: "var(--font-brand)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            Check
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            in.
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.55)",
            }}
          >
            Stand
          </div>
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.55)",
            }}
          >
            out.
          </div>
        </div>

        {/* Scroll indicator — fades out on first scroll */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: phaseA > 0.05 ? 0 : 1,
            transition: "opacity 400ms ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            zIndex: 2,
          }}
        >
          <div
            className="animate-scroll-pulse"
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
            }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-brand)",
            }}
          >
            SCROLL
          </span>
        </div>

        {/* Phone reveal — right side */}
        <PhoneReveal phaseA={phaseA} step={step} />

        {/* Floating CTA — left side, appears at step 3 */}
        <FloatingCTA visible={showFloatingCTA} />
      </div>
    </div>
  );
};

export default HeroSection;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/HeroSection.tsx
git commit -m "Rewrite HeroSection: ghost headline, sticky scroll zone, phone reveal, floating CTA"
```

---

## Task 12: HowItWorks section

**Files:**

- Rewrite: `src/pages/landing/components/HowItWorks.tsx`

Dark background, ghost-style step numbers (`01` `02` `03`), scroll-reveal per step via IntersectionObserver. Uses existing i18n keys unchanged.

- [ ] **Step 1: Rewrite HowItWorks.tsx**

```tsx
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 600ms ease, transform 600ms ease",
        fontFamily: "var(--font-brand)",
      }}
    >
      {/* Ghost number */}
      <div
        style={{
          fontSize: "clamp(64px, 8vw, 96px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.15)",
          flexShrink: 0,
          width: 100,
        }}
      >
        {number}
      </div>
      <div style={{ paddingTop: 12 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = t("landing.howItWorks.steps", { returnObjects: true }) as {
    step: string;
    title: string;
    description: string;
  }[];

  return (
    <section style={{ background: "#0a0a0a", padding: "120px 5% 120px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.04em",
            marginBottom: 80,
            fontFamily: "var(--font-brand)",
          }}
        >
          {t("landing.howItWorks.title")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {steps.map(({ step, title, description }) => (
            <Step
              key={step}
              number={String(step).padStart(2, "0")}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/HowItWorks.tsx
git commit -m "Rewrite HowItWorks: dark section with ghost numbers and scroll reveal"
```

---

## Task 13: FooterCTA section

**Files:**

- Rewrite: `src/pages/landing/components/FooterCTA.tsx`

Static CSS gradient (no second ShaderGradient). Centered headline, LinkedIn sign-in. Uses existing i18n keys.

- [ ] **Step 1: Rewrite FooterCTA.tsx**

```tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #5606ff 0%, #8b35ff 50%, #fe8989 100%)",
        padding: "120px 5%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          fontFamily: "var(--font-brand)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {t("landing.footerCta.title")}
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
            maxWidth: 440,
          }}
        >
          {t("landing.footerCta.description")}
        </p>
        <Link to="/auth" style={{ textDecoration: "none" }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              color: "#111",
              fontSize: 16,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 32,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-brand)",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                background: "#0a66c2",
                borderRadius: 4,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              in
            </span>
            {t("common.buttons.signInWithLinkedIn")}
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FooterCTA;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/landing/components/FooterCTA.tsx
git commit -m "Rewrite FooterCTA: static gradient, LinkedIn sign-in, existing i18n keys"
```

---

## Task 14: Rewire Landing.tsx

**Files:**

- Rewrite: `src/pages/Landing.tsx`

Wire all components together. Add `--font-brand` CSS variable. Remove old sub-component imports. Auth state stays exactly as-is.

- [ ] **Step 1: Rewrite Landing.tsx**

```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import GradientBackground from "./landing/components/GradientBackground";
import LandingNav from "./landing/components/LandingNav";
import HeroSection from "./landing/components/HeroSection";
import HowItWorks from "./landing/components/HowItWorks";
import FooterCTA from "./landing/components/FooterCTA";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div
      style={
        {
          position: "relative",
          minHeight: "100vh",
          // CSS variable for Plus Jakarta Sans used throughout landing components
          "--font-brand": "'Plus Jakarta Sans', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <GradientBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <LandingNav user={user} onSignOut={handleSignOut} />
        <HeroSection />
        <HowItWorks />
        {!user && <FooterCTA />}
        <footer
          style={{
            background: "#0a0a0a",
            padding: "32px 5%",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: 13,
              fontFamily: "var(--font-brand)",
            }}
          >
            © 2026 LinkBack
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
```

- [ ] **Step 2: Delete old FeaturesGrid.tsx**

The features grid section has been merged into the phone screen steps. Delete the now-unused file:

```bash
rm src/pages/landing/components/FeaturesGrid.tsx
```

- [ ] **Step 3: Run the dev server and do a full visual walkthrough**

```bash
npm run dev
```

Check:

1. Gradient animates on load
2. Nav is transparent with white text
3. Ghost headline is visible
4. Scroll makes phone slide up from bottom
5. Color cast shifts purple/pink on the hand
6. Phone screen shows blank → QR → attendees → CTA
7. Floating CTA appears left of phone at step 3
8. How It Works section reveals on scroll
9. Footer CTA renders gradient

- [ ] **Step 4: Run existing tests to confirm no regressions**

```bash
npm run test
```

Expected: all pre-existing tests pass. The landing page has no business logic, so no logic tests should break.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing.tsx
git rm src/pages/landing/components/FeaturesGrid.tsx
git commit -m "Rewire Landing.tsx: wire all new components, remove FeaturesGrid"
```

---

## Task 15: Screen inset calibration

**Files:**

- Modify: `src/pages/landing/components/PhoneReveal.tsx` (`SCREEN_INSET` constants)

The screen overlay must align precisely with the blank white screen area in `phone-hand.png`. This is done by measurement, not guesswork.

- [ ] **Step 1: Measure the screen area**

Open the app in the browser. Open DevTools. Inspect the `<img>` element for `phone-hand.png`. Note its rendered pixel dimensions (`offsetWidth`, `offsetHeight`).

Using the image as reference, identify the pixel coordinates of:

- Top-left corner of the screen: `(screenLeft, screenTop)`
- Bottom-right corner of the screen: `(screenRight, screenBottom)`

Convert to percentages:

```
top    = screenTop    / imgHeight * 100
left   = screenLeft   / imgWidth  * 100
width  = (screenRight - screenLeft) / imgWidth  * 100
height = (screenBottom - screenTop) / imgHeight * 100
```

- [ ] **Step 2: Update SCREEN_INSET in PhoneReveal.tsx**

Replace the placeholder values with the measured percentages:

```tsx
const SCREEN_INSET = {
  top: "<measured>%",
  left: "<measured>%",
  width: "<measured>%",
  height: "<measured>%",
};
```

- [ ] **Step 3: Verify overlay alignment**

Set `step={1}` temporarily in `HeroSection.tsx` to force the QR step visible, scroll down to Phase B, and visually confirm the QR code sits exactly within the phone screen. Revert the forced step after confirming.

- [ ] **Step 4: Commit**

```bash
git add src/pages/landing/components/PhoneReveal.tsx
git commit -m "Calibrate phone screen overlay inset to match phone-hand.png"
```

---

## Task 16: Final polish and smoke tests

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

All tests pass.

- [ ] **Step 2: Check for console.log**

```bash
grep -r "console\.log" src/pages/Landing.tsx src/pages/landing/
```

Expected: no output.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Accessibility spot-check**

Confirm:

- Nav sign-in button has visible label
- Phone image has `aria-hidden="true"` (decorative)
- All interactive elements (Link, button) are keyboard-reachable
- Scroll zone does not trap keyboard focus

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Landing redesign: final polish and build verification"
```
