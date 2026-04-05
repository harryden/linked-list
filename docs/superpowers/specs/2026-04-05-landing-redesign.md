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

**Phone position:** The hand+phone PNG sits in the **right half** of the viewport (roughly centered at 65–70% from left). This deliberately leaves the left half open for the ghost headline (Phase A) and the floating CTA (Phase B end).

**Phase B — Phone screen reveals (~400vh of scroll)**

Phone is locked in place. Each scroll threshold reveals the next step of content on the phone screen via a CSS overlay div precisely positioned over the blank white screen area of the PNG:

| Step | Scroll progress into Phase B | Phone screen content                                                                                                         |
| ---- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1    | 0% (lock point)              | Blank white — screen wakes, clean and empty                                                                                  |
| 2    | 33%                          | QR code scales + fades in, "Scan to sign in" label, `linkback.app/auth` URL below                                            |
| 3    | 66%                          | Attendee list view: event name, date, check-in count, 3 attendee rows with gradient avatars + LinkedIn blue badge, "+N more" |
| 4    | 100%                         | "Host smarter events." headline, one-liner, "Get started free" purple button, "See how it works →" link                      |

Each transition: 400ms ease, previous content fades out, new content fades in. Font inside all steps: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue"` — iOS system font for authentic feel.

**QR code is functional:** The QR code at Step 2 encodes the full production sign-in URL (`https://linkback.app/auth`). Scanning it with a real phone camera redirects to sign-in — live CTA, not decoration. Reuse `QRCodePreview` (`src/components/QRCodePreview.tsx`) with the auth URL. No new logic.

**Floating CTA (appears left of phone at Step 4)**

When scroll reaches 100% of Phase B, a CTA block fades + slides in on the **left half of the viewport**, positioned vertically centered alongside the phone. It does not appear beneath the phone — it floats in the open space to the left.

Contents:

- Small eyebrow label: `"LinkBack"`
- Ghost headline (matching hero style): `"Check in.` / `Stand out."` — solid top line, outlined bottom line
- One-liner: `"LinkedIn-verified attendance for events that matter."`
- LinkedIn sign-in button (white pill, LinkedIn blue `in` icon, dark text): `"Sign in with LinkedIn"`
- Secondary link: `"See how it works →"`

Animation: `opacity 0 → 1`, `translateX(-20px) → 0`, 600ms ease, triggers at step 4.

Scroll tracking: Lenis emits a `scroll` event. Progress is computed as `(scroll - phaseAEnd) / phaseBHeight`, clamped to `[0, 1]`. Step thresholds at 0%, 33%, 66%, 100%.

**Phone screen status bar + Dynamic Island (always visible once phone screen is active)**

Replicates iPhone 14/15 status bar layout. Dark text/icons on white background.

```
[ 9:41 ]     [ ◆◆ pill ]     [ signal ] [ wifi ] [ battery ]
```

- **Dynamic Island:** centered black pill, `44px × 12px`, `border-radius: 10px`
- **Time (left):** live clock, `useState` + `setInterval` (1 min), `HH:MM` format, `8px`, `font-weight: 600`, dark (`#111`)
- **Icons (right):** signal bars, wifi, battery — inline SVGs, `8px`, dark (`#111`)
- Strip height: `~24px`, `padding: 8px 12px 0`

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

- Stock photo or AI-generated: hand holding iPhone from below, blank white screen, facing camera
- **Neutral white rim lighting only — no colored gels baked in.** The CSS color cast layer handles all purple/pink tinting dynamically.
- Transparent PNG: generate/shoot on solid white or green background, remove background via remove.bg or Photoshop
- Sharp edges on fingers — no motion blur, essential for clean cutout
- Screen fully clear — no fingers overlapping the screen area (overlay div sits directly over it)
- Target size: ~800px wide for retina display at intended render width of ~400px
- File path: `src/assets/phone-hand.png` — added to `.gitignore` until a licensed image is purchased; placeholder used for local development only

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
