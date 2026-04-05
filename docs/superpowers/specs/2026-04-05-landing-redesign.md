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

**Background:** Full-page animated ShaderGradient (`shader-gradient` npm package) using the waterPlane shader with the following config:

```
color1="#5606ff" color2="#fe8989" color3="#000000"
type="waterPlane" uSpeed={0.2} uStrength={2.4} uDensity={0.7}
cDistance={3.91} cPolarAngle={115} cAzimuthAngle={180}
rotationZ={235} brightness={1.1}
```

The gradient is a persistent full-page canvas — all three acts render on top of it.

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

The hero occupies approximately `500vh` of scroll height. The viewport stays fixed (sticky) while the user scrolls through this zone, giving the appearance that the page is a single animated scene.

**Step 0 — Initial state (page load)**

- Ghost headline visible, left-aligned, centered vertically
- Scroll indicator: thin vertical line pulsing downward, fades out on first scroll
- Phone not yet visible

**Step 1 — Phone reveal (scroll begins)**

- AI-generated hand+phone PNG fades in (opacity 0 → 1, translateY 40px → 0)
- Phone positioned center-right of the viewport
- Phone screen overlay div appears, initially empty/dark

**Color cast layer (always active once phone is visible)**

- A `position: absolute` div covers the hand PNG exactly
- Contains a slow CSS gradient animation echoing `#5606ff` → `#fe8989`
- `mix-blend-mode: overlay`, `opacity: 0.2`
- This casts dynamic colored shadows on the hand as the ShaderGradient shifts beneath it — purple-tinted shadows when gradient is cool, rose-tinted when warm

**Steps 2–5 — Phone screen reveals (scroll-driven)**

A CSS overlay div is positioned precisely over the phone screen area of the PNG. Each scroll threshold triggers a new state on the phone screen:

| Step | Scroll position | Phone screen content                        |
| ---- | --------------- | ------------------------------------------- |
| 2    | 20% into zone   | QR code animates in (scale + fade)          |
| 3    | 40% into zone   | LinkedIn verified badge slides up           |
| 4    | 60% into zone   | Attendee list preview fades in              |
| 5    | 80% into zone   | CTA button + "See how it works" link appear |

Each transition: 400ms ease, previous content fades out, new content fades in.

Scroll tracking: `IntersectionObserver` on sentinel divs stacked in the scroll zone, or `scroll` event with `scrollY` thresholds mapped to the sticky container's `offsetTop`.

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
- `Plus Jakarta Sans` — loaded via Google Fonts link in `index.html`
- No other new dependencies

---

## Out of Scope

- Auth, Dashboard, Event, EventSuccess, JoinEvent, CreateEvent, Demo, NotFound pages — separate redesign cycles
- Knowledge graph feature
- Any changes to Supabase queries, edge functions, or auth flow
- Changes to i18n translation values (keys reused, copy unchanged)
