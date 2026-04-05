# Landing Page Redesign

**Date:** 2026-04-05
**Scope:** Landing page only (`src/pages/Landing.tsx` and its sub-components). No other pages, no logic changes.

---

## Constraints

- Zero changes to routing, authentication, data fetching, or business logic
- All existing i18n translation keys remain unchanged — only the JSX structure around them changes
- Nav auth state (user vs guest rendering) stays exactly as-is
- All existing page sections survive — Features, How It Works, Footer CTA — presentation only changes

---

## Visual Identity

**Palette:** `#5606ff` (purple) · `#fe8989` (pink) · `#000000` (black)

**Background:** Full-page auto-animating ShaderGradient (`shader-gradient` npm package) using the waterPlane shader. The gradient runs freely and continuously — it is not scroll-driven. This keeps the background alive at all times, including when the user is paused or reading.

Config:

```
color1="#5606ff" color2="#fe8989" color3="#000000"
type="waterPlane" animate="on" uSpeed={0.2} uStrength={2.4} uDensity={0.7}
cDistance={3.91} cPolarAngle={115} cAzimuthAngle={180}
rotationZ={235} brightness={1.1}
```

The gradient canvas is `position: fixed`, `inset: 0`, `z-index: 0` — all page content sits above it.

**Typography:** Ghost outline style. Headline uses two layers:

- Top words: solid white, ultra-heavy weight (font-weight 900), tight tracking (-0.05em)
- Lower words: outlined only via `-webkit-text-stroke`, transparent fill, same size

Scale is viewport-relative (roughly `10–14vw`) so the type feels large on all screens. Left-aligned.

**Font:** Plus Jakarta Sans (weights 400, 700, 900) loaded via Google Fonts. Fallback: system-ui.

---

## Navigation

- Transparent background, no border
- White logotype and links
- Sign-in button: frosted glass pill (`backdrop-filter: blur(12px)`, white border at 25% opacity, white text)
- Sticky top, `z-index` above gradient canvas
- Auth state logic (show "My Events" + sign-out vs "Sign in with LinkedIn") unchanged

---

## Page Structure

### Act 1 — Hero sticky scroll zone

The hero section has two distinct scroll phases and occupies approximately `600vh` of total scroll height. A sticky viewport panel (`position: sticky; top: 0; height: 100vh`) contains all the action — the tall scroll height is what creates the illusion of a slow, cinematic reveal.

**Phase A — Phone slide-up (~200vh of scroll)**

The ghost headline is visible from the start, left-aligned, centered vertically. The ShaderGradient animates freely behind it.

On page load, the hand+phone PNG is positioned so only the top ~25% of the phone (the top bezel of the handset) peeks above the bottom edge of the viewport — the rest of the image is below the fold.

As the user scrolls, the phone image translates upward continuously (`translateY` driven by `scrollY`). The motion is smooth and linear — the full handset appears first, then the hand, then the arm at the bottom of the image.

- Scroll indicator: thin vertical line at the bottom center, pulsing downward, fades out on first scroll
- Phone screen overlay div is present but empty/transparent during this phase — no content yet

**Lock point:** When the bottom of the phone image reaches the bottom of the viewport (full image visible), the image stops translating. The phone is now fully visible and centered in the right half of the viewport. All further scroll is consumed by Phase B.

**Color cast layer (active as soon as phone is partially visible)**

- A `position: absolute` div covers the hand PNG exactly
- Contains a slow CSS gradient animation cycling `#5606ff` → `#fe8989`, tied to the auto-animating ShaderGradient's approximate color cycle (CSS `@keyframes`, ~8s loop)
- `mix-blend-mode: overlay`, `opacity: 0.2`
- Casts dynamic colored shadows on the hand — purple-tinted when cool, rose-tinted when warm

**Phase B — Phone screen reveals (~400vh of scroll)**

Phone is locked in place. Each scroll threshold reveals the next step of content on the phone screen via a CSS overlay div precisely positioned over the screen area of the PNG:

| Step | Scroll progress into Phase B | Phone screen content                                      |
| ---- | ---------------------------- | --------------------------------------------------------- |
| 1    | 0% (lock point)              | Screen fades from transparent to dark/app-like background |
| 2    | 25%                          | QR code scales + fades in                                 |
| 3    | 50%                          | LinkedIn verified badge slides up                         |
| 4    | 75%                          | Attendee list preview fades in                            |
| 5    | 100%                         | CTA button + "See how it works" link appear               |

Each transition: 400ms ease, previous content fades out, new content fades in.

**QR code is functional:** The QR code rendered at Step 2 encodes the full production sign-in URL (`https://linkback.app/auth`). Scanning it with a real phone camera redirects to sign-in — the QR code is a live CTA, not decoration. Reuse the existing `QRCodePreview` component (`src/components/QRCodePreview.tsx`) with the auth URL as the value. No new logic — the component already handles QR generation.

Scroll tracking: Lenis emits a `scroll` event with the current `scroll` value. Progress is computed as `(scroll - phaseAEnd) / phaseBHeight`, clamped to `[0, 1]`. Step thresholds are derived from this normalized value.

**Phone screen status bar (always visible)**

A thin strip permanently pinned to the top of the phone screen overlay div, visible across all steps. Never animates in or out — it is always present once the phone screen is active.

Contents (left to right):

- **Time:** Live clock rendered in a React `useState` + `setInterval` (1 minute interval), reads `new Date()` and formats as `HH:MM`. White text, small font (~10px), medium weight.
- **WiFi icon:** Simple inline SVG, white
- **Battery icon:** Simple inline SVG showing ~80% fill, white

Styling: `height: ~20px`, white text/icons, `font-size: ~10px`, `padding: 0 8px`. Sits at `z-index` above all step content so it is never obscured.

---

### Act 2 — How it works

Begins immediately after the sticky zone exits.

- Background: near-black (`#0a0a0a`) — hard contrast break from the gradient
- 3 steps, each with a large step number (`01` `02` `03`) in outlined ghost style matching the hero type
- Step title and description below each number
- Each step fades + slides in via `IntersectionObserver` as it enters the viewport
- Existing i18n strings from `landing.howItWorks` used unchanged

---

### Act 3 — CTA

- Full-width section, gradient returns as a static CSS `linear-gradient(135deg, #5606ff, #fe8989)` — no second ShaderGradient instance (performance)
- Centered headline and subtext using existing `landing.footerCta` i18n keys
- LinkedIn sign-in button (existing logic)
- Visually echoes the hero opening — bookends the page

---

## Asset Requirements

**Hand + phone image** (produced by user before implementation):

- AI-generated: hand holding iPhone, screen showing a QR code
- Transparent PNG (generate on solid white or green background, remove with remove.bg or Photoshop)
- Purple (`#5606ff`) rim light from left, pink (`#fe8989`) rim light from right
- No motion blur on finger edges — clean cutout essential for background removal
- Target size: ~800px wide for retina display at intended render width of ~400px

---

## Dependencies

- `shader-gradient` — new npm dependency for the ShaderGradient component
- `lenis` — smooth scroll library, wraps the app at the root level, provides inertia-based scroll feel and emits scroll events consumed by the phone reveal logic
- `Plus Jakarta Sans` — loaded via Google Fonts link in `index.html`

---

## Out of Scope

- Auth, Dashboard, Event, EventSuccess, JoinEvent, CreateEvent, Demo, NotFound pages — separate redesign cycles
- Knowledge graph feature
- Any changes to Supabase queries, edge functions, or auth flow
- Changes to i18n translation values (keys reused, copy unchanged)
