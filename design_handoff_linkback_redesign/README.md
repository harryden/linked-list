# Handoff: LinkBack UI Redesign — Precision Utility

## Overview
Complete visual overhaul of LinkBack, a B2B event networking tool, from its current "gradient pink / glassmorphism" aesthetic to a monochrome, high-contrast **Precision Utility** direction inspired by Linear and Vercel. Covers every route in the existing React/Vite/Tailwind/shadcn/Supabase codebase: Landing, Auth, Dashboard, Create Event, Event Page (pre & post check-in), Event Success, and the QR modal signature moment.

## About the Design Files
The HTML files in this bundle are **design references**, not production code. They are React prototypes rendered inside a zoomable design canvas and are meant to communicate layout, tokens, spacing, typography, and interaction intent with pixel-level precision.

**Your job:** reproduce these designs in the existing **`linked-list/`** codebase (React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui + Radix + Lucide + Tanstack Query + Supabase) using the repo's established patterns. Do **not** copy the prototype's inline-style approach; instead, express the same visual result through Tailwind utilities, shadcn component overrides, and CSS variables in `src/index.css`.

## Fidelity
**High-fidelity.** All colors, type sizes, weights, letter-spacing, radii, shadows, spacing, and border-widths in the prototypes are the intended production values. Match them exactly.

## Build order (important)
1. **Token rewrite** — copy `starter/src/index.css` → `src/index.css` and `starter/tailwind.config.ts` → `tailwind.config.ts` (drop-in replacements, ready to go). See `starter/README.md` for install steps. Then remove any remaining `animate-border-glow`, shimmer utilities, and `bg-gradient-subtle` usages across `src/`.
2. **Typography** — install `@fontsource/geist-sans` (and `@fontsource/geist-mono` for mono use), swap the `body` font-family in `index.css`, and enable `font-feature-settings: "cv02","cv03","cv04","cv11"`.
3. **shadcn re-skin** — walk `src/components/ui/*.tsx` and strip gradient backgrounds, colored rings, and ambient shadows from `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `toast.tsx`, `avatar.tsx`. Apply the new `border-subtle` + flat-surface paradigm.
4. **Route-by-route re-layout** — in this order: `Landing.tsx` → `Auth.tsx` → `Dashboard.tsx` → `CreateEvent.tsx` → `EventPage.tsx` → `EventSuccess.tsx`. Preserve all hook logic, react-query calls, Supabase interactions, and `data-testid` attributes. Only the class names and wrapper `<div>` structure change.
5. **Signature moments** — `npm install framer-motion`. Implement two specific animations:
   - **Check-In button** (`AttendButton`): on click, label cross-fades to a horizontal linear loader; on success the button physically expands into the green success banner with a spring (`stiffness: 300, damping: 25`).
   - **QR modal** (`QRCodeDialog`): backdrop fades to `rgba(0,0,0,0.6)`, modal scales `0.95 → 1.0` with a tight spring. QR renders stark black-on-white, no rounding on the QR itself.
6. **Accessibility sweep** — global `:focus-visible` ring using `ring-2 ring-black ring-offset-2`. Wrap all keyframe/spring motion in `@media (prefers-reduced-motion: no-preference)`.

## Design tokens

Paste into `src/index.css`:

```css
@layer base {
  :root {
    /* Surfaces */
    --bg-base:          0 0% 100%;        /* #FFFFFF */
    --bg-surface:       0 0% 98%;         /* #FAFAFA */
    --bg-surface-hover: 240 5% 96%;       /* #F4F4F5 */

    /* Borders */
    --border-subtle:    240 6% 90%;       /* #E4E4E7 */
    --border-strong:    240 5% 84%;       /* #D4D4D8 */

    /* Text */
    --text-primary:     240 10% 4%;       /* #09090B */
    --text-secondary:   240 4% 46%;       /* #71717A */

    /* Brand (monochrome accent) */
    --brand-accent:     0 0% 0%;          /* #000000 */
    --brand-hover:      240 5% 15%;       /* #27272A */

    /* States */
    --state-success:    160 84% 30%;      /* #059669 */
    --state-success-bg: 152 81% 96%;      /* #ECFDF5 */
    --state-error:      0 74% 50%;        /* #DC2626 */
    --state-error-bg:   0 86% 97%;        /* #FEF2F2 */

    /* Third-party */
    --brand-linkedin:   210 90% 40%;      /* #0A66C2 */

    /* Radius */
    --radius-sm: 6px;     /* inputs, buttons */
    --radius-md: 12px;    /* cards, modals */
    --radius-full: 9999px;/* avatars, badges */

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05);

    /* Motion */
    --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out:    cubic-bezier(0.4, 0, 1, 1);
    --dur-fast:    150ms;
    --dur-med:     300ms;
  }
}
```

Add to `tailwind.config.ts` under `theme.extend`:
```ts
colors: {
  'bg-base':           'hsl(var(--bg-base))',
  'bg-surface':        'hsl(var(--bg-surface))',
  'bg-surface-hover':  'hsl(var(--bg-surface-hover))',
  'border-subtle':     'hsl(var(--border-subtle))',
  'border-strong':     'hsl(var(--border-strong))',
  'text-primary':      'hsl(var(--text-primary))',
  'text-secondary':    'hsl(var(--text-secondary))',
  'brand-accent':      'hsl(var(--brand-accent))',
  'brand-hover':       'hsl(var(--brand-hover))',
  'state-success':     'hsl(var(--state-success))',
  'state-success-bg':  'hsl(var(--state-success-bg))',
  'state-error':       'hsl(var(--state-error))',
  'state-error-bg':    'hsl(var(--state-error-bg))',
  'brand-linkedin':    'hsl(var(--brand-linkedin))',
},
fontFamily: {
  sans: ['Geist','Inter','system-ui','-apple-system','sans-serif'],
  mono: ['"Geist Mono"','"JetBrains Mono"','ui-monospace','Menlo','monospace'],
},
```

Delete: all existing `--gradient-*`, `--glow-*`, `--primary*`, `shadow-glow-*` tokens and utilities.

## Typography scale

| Name         | Size          | LH   | Weight | Tracking  | Usage |
|--------------|---------------|------|--------|-----------|-------|
| `h1`         | 36px / 2.25rem| 1.1  | 600    | -0.02em   | Page headers, hero |
| `h2`         | 24px          | 1.2  | 600    | -0.01em   | Section headers |
| `h3`         | 20px          | 1.3  | 500    | -0.01em   | Card/modal titles |
| `body-lg`    | 16px          | 1.5  | 400    | 0         | Primary reading |
| `body`       | 14px          | 1.5  | 400    | 0         | Standard UI |
| `body-medium`| 14px          | 1.5  | 500    | 0         | Button labels, table headers |
| `caption`    | 12px          | 1.4  | 400    | 0         | Metadata, helpers |

Mono (Geist Mono) is used for: eyebrow labels (11–12px, letter-spacing 0.8–1px, uppercase, `text-secondary`), code/IDs, dates in mono-numeric contexts, check-in codes.

## Spacing

4px grid. Scale: `2, 4, 8, 12, 16, 24, 32, 48, 64, 96`.
Rules:
- Component internal padding: **16px**
- Inter-component: **24px**
- Section: **64px**
- Container max-width: **1024px**, centered, 16px gutters on mobile

## Component specs

### Button (`src/components/ui/button.tsx`)
Sizes: `sm` (h-8 px-3 text-xs), `md` (h-10 px-4 text-sm), `lg` (h-12 px-6 text-base), `xl` (h-14 px-8 text-base; event check-in).
Variants:
- **primary**: `bg-brand-accent text-white border-transparent shadow-sm`, hover `bg-brand-hover`
- **secondary**: `bg-bg-surface-hover text-text-primary`, hover `bg-border-subtle`
- **outline**: `bg-transparent border border-border-subtle text-text-primary`, hover `bg-bg-surface`
- **ghost**: `bg-transparent border-none text-text-secondary`, hover `text-text-primary bg-bg-surface`
- **linkedin**: `bg-brand-linkedin text-white` (only the auth SSO button)
- **success**: `bg-state-success text-white`
All: `rounded-md` (6px), `transition: background var(--dur-fast) var(--ease-spring)`. Disabled: `opacity-50 cursor-not-allowed`.

### Input (`src/components/ui/input.tsx`)
Default: `h-10 px-3 bg-bg-surface border border-border-subtle rounded-md text-sm text-text-primary placeholder:text-text-secondary`.
Focus (`:focus-visible`): `bg-bg-base border-border-strong ring-2 ring-border-subtle ring-offset-0` (the ring is the halo, not a color ring).
Error: `border-state-error ring-2 ring-state-error-bg`.

### Card
`bg-bg-base border border-border-subtle rounded-xl` (12px). No shadow by default. Hover on list cards: `translateY(-1px)` + `shadow-md`. Remove all `shadow-xl` uses.

### Avatar
Sizes: 24 / 32 / 48. Always `rounded-full`, 1px `border-border-subtle`. Fallback: `bg-bg-surface-hover text-text-secondary font-medium`.

### Toast
`bg-bg-base border border-border-subtle shadow-lg rounded-lg`. Success variant prepends a 16px `state-success` `CheckCircle2`. Bottom-right on desktop, top-center on mobile, slide-up entry (150ms).

### Skeleton
`bg-bg-surface-hover`, pulse animation on `opacity: 1 ↔ 0.5` over 1.5s. No shimmer gradient.

### Status pill (organizer dashboard)
11px, `px-2 py-[3px]`, `rounded` (4px), `border`, `font-medium`.
- `live`: `bg-state-success-bg text-state-success border-state-success` + 6px pulsing dot
- `upcoming`: `bg-bg-surface text-text-primary border-border-subtle`
- `draft`: `bg-bg-surface-hover text-text-secondary border-border-subtle`

## Route-by-route spec

### Landing — `/` (`src/pages/Landing.tsx`)
- **Nav**: logo left (26×26 black square with "L", radius 6; name "LinkBack" 15/600). Right: ghost `Product / Pricing / Changelog`, divider, ghost "Sign in", primary "Create event". On scroll > 60px: nav becomes `sticky` with `rgba(255,255,255,0.8) backdrop-blur`.
- **Hero**: Left-aligned on desktop, centered on mobile. Eyebrow pill: mono 12px, 1px `border-subtle`, rounded-full, with 6px `state-success` dot — e.g. "v2.4 — Check-in codes are live". `h1`: 64px on desktop (36 on mobile), `tracking-[-0.03em]`, `leading-[1.02]`, max-width 720px. Body: 18/1.5 `text-secondary`, max-width 560px. CTAs: primary `lg` "Create your first event" + outline `lg` "Join with code".
- **Grid pattern behind hero**: radial-mask 64×64px `border-subtle` grid, opacity 0.6, fading to transparent outward.
- **Product preview frame** (below hero): `border border-border-subtle rounded-xl bg-bg-surface p-2 shadow-lg`. Inside, browser-chrome row (three 10px grey dots + mono URL). Inner panel: `bg-bg-base rounded-lg border-border-subtle`, two-column (event meta | attendee preview rows).
- **Features**: 3-column grid, 32px gutter. Each: mono `01/02/03` eyebrow, 18/500 title, 14 `text-secondary` body. No cards, no icons.
- **Footer**: 64px top padding, 1px top border.

### Auth — `/auth` (`src/pages/Auth.tsx`)
- Centered single column, `max-w-[400px]`.
- Top bar: small logo left, ghost "Close" right.
- Mono eyebrow "SIGN IN" → h2 "Pick up where you left off." (28/600, tracking -0.5). 14 `text-secondary` sub.
- **SSO button**: full-width `xl`, `bg-brand-linkedin text-white`, LinkedIn glyph SVG (white, 18px) left of "Continue with LinkedIn".
- Divider: two 1px lines with mono "OR" between.
- Secondary outline `lg` "Enter event code".
- Legal caption, centered, 12 `text-secondary`.
- Footer: 1px top border, mono v2.4.0 + linkback.app.

### Dashboard — `/dashboard` (`src/pages/Dashboard.tsx`)
- Desktop: 240px left sidebar (`bg-bg-base`, 1px right border), main area `bg-bg-surface`.
- Mobile: sidebar replaced by bottom tab bar (not shown in mocks; mirror the sidebar items).
- Sidebar items (`h-9 px-2.5 rounded-md text-[13px]`): Dashboard / My events / Attendees / Check-in codes / Settings. Active item: `bg-bg-surface-hover text-text-primary`; inactive: `text-text-secondary`. User chip pinned bottom (avatar 28 + name/email, 1px border).
- **Greeting row**: mono "DASHBOARD" eyebrow + h1 "Welcome back, Jamie." (32/600, tracking -0.8) + 14 `text-secondary` counts. Primary "Create event" button right.
- **Stats row**: 4 cards, `bg-bg-base border rounded-xl p-4`. Each: mono label → 28/600 tabular-nums number → 12 `text-secondary` sub.
- **My events list**: single card with rows separated by 1px `border-subtle`. Columns: `2fr | 1.2fr | 1fr | 120px` — name/location, mono date, status pill + guest count, actions (outline Manage + ghost meatball).
- **Attending list**: simpler 1-line rows, outline "View" on right.
- **Empty state**: centered, 14 `text-secondary` "No events found.", primary "Create Event" button underneath. No emoji.

### Create Event — `/create-event` (`src/pages/CreateEvent.tsx`)
- Top bar: ghost back arrow, 1px divider, "New event" label, ghost "Save draft".
- Centered `max-w-[640px]`.
- Mono eyebrow "CREATE EVENT · STEP 1 OF 2" → h1 "Set the details." → 14 `text-secondary` intro.
- Fields stacked at 20px gap. Event name (full), Date + Start time (two-col), Location (full), Description (textarea 96px min-height), Check-in method (2 cards: QR selected with 1px `brand-accent` border + ring; Shareable link outline).
- Form footer: 1px top border, ghost "Discard" left, primary "Continue" right (desktop). On mobile: primary becomes fixed bottom bar.

### Event Page — `/event/:slug` (`src/pages/EventPage.tsx`)
- Mobile: stacked. Desktop: split — left event meta, right attendee list, 24px gutter.
- Top bar: outline 36px icon buttons (back / share), mono event-code label center-left.
- Organizer row: 24px avatar + "Hosted by {name}" in 13 `text-secondary`.
- h1 event name (28/600, tracking -0.6) mobile; 36/600 desktop.
- Meta rows: 32×32 `bg-bg-surface` icon tile + 2-line text (title 13/500, sub 12 mono `text-secondary`). Calendar + MapPin.
- **Check-in CTA**:
  - Not checked in: full-width `xl` primary button with ArrowRight, label "Check in".
  - Checked in: `bg-state-success-bg border border-state-success rounded-lg p-[14px_16px]` banner, 20px `CheckCircle2` in `state-success`, two-line text "Checked in at {time}" + "You're on the roster." both in `state-success`.
- **Attendee list**: section label "In the room" 14/500 + mono count " · LIVE" right. 12 `text-secondary` helper below. Rows: 32 avatar + name 13/500 + headline 12 `text-secondary` truncated + mono join time right. 1px bottom border between rows, no outer card border.

### Event Success — `/event-success/:slug` (`src/pages/EventSuccess.tsx`)
- Full-screen takeover.
- 56px `state-success-bg` circle with 28 `CheckCircle2` (stroke-width 1.5).
- Mono "CHECKED IN · {time}" in `state-success`.
- h1 "You're in." 40/600, tracking -1.
- 15 `text-secondary` subhead.
- Tonight card: 1px `border-subtle`, `bg-bg-surface`, mono eyebrow + overlapping avatar stack (5 avatars, -8px overlap) + "+ 5 more".
- Buttons stack bottom: primary `xl` "View attendees", outline `lg` "Save to contacts".

### QR Modal (`src/components/QRCodeDialog.tsx`) — signature moment
- Backdrop: `rgba(0,0,0,0.6)` with `backdrop-blur-sm`.
- Modal: `bg-bg-base rounded-xl p-6 shadow-lg`, spring scale 0.95→1.0 (stiffness 300, damping 20), 300ms.
- Header: mono "CHECK-IN CODE" + 18/600 event name left; ghost 32px "×" close right.
- QR: **stark** black-on-white, 1px `border-subtle` frame, 20px inner padding, rounded-sm only on the frame (QR cells themselves have no radius).
- Under QR: mono "OR ENTER CODE" + 24/600 mono code with 6px letter-spacing and tabular-nums ("9F · 4XA2" style).
- Two buttons: outline "Save" (download icon) + primary "Share" (share icon), 2-col grid 8px gap.

## Signature animations (framer-motion)

```tsx
// Check-in button expand
<motion.div
  layout
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  className={isCheckedIn ? 'success-banner' : 'primary-btn'}
>…</motion.div>

// QR modal
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1,    opacity: 1 }}
  exit   ={{ scale: 0.95, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>…</motion.div>
```

Wrap both in `useReducedMotion()` checks — if true, skip spring and use 150ms opacity-only.

## Accessibility

- Contrast: `text-secondary (#71717A)` on `bg-surface (#FAFAFA)` = 4.53:1 — passes AA. Verify all other combinations.
- Focus ring: in `index.css`:
  ```css
  *:focus-visible { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000; border-radius: inherit; }
  ```
- Dialog: Radix `Dialog` already traps focus — keep that behavior.
- Motion: wrap keyframes in `@media (prefers-reduced-motion: no-preference)`.

## State & logic — do not touch
- All hooks in `src/hooks/` (`useEvents`, `useAttendances`, `useProfile`) keep their current signatures.
- Supabase client calls, realtime subscriptions, analytics tracking (`analytics.track('event_joined', …)`) — unchanged.
- `data-testid` attributes — unchanged so `e2e/*.spec.ts`, `supabase.test.tsx`, `AuthRedirectFlow.test.tsx` keep passing.
- Toast copy in `src/constants/text.ts` — unchanged.

## Assets
- Replace `src/assets/linkback-logo.png` with a new mark: 26×26 rounded-6 black square, white "L" in Geist 600 -0.5 tracking. (Provide at 1×/2×/3× PNG or ship as an inline SVG component.)
- Install `@fontsource/geist-sans` and `@fontsource/geist-mono`, import in `main.tsx`.
- Install `framer-motion`.

## Files in this handoff
- `LinkBack Redesign.html` — zoomable canvas of every screen + the design-system specimen. Open and pan/zoom to inspect any surface. Click a label or the expand icon to focus one artboard.
- `LinkBack Redesign-print.html` — one-artboard-per-page print layout.
- `screens.jsx` — React source for all the prototype screens. Use as the authoritative reference for layouts, colors, spacing, and copy. Inline styles correspond 1:1 to the tokens above.
- `design-canvas.jsx` — canvas wrapper (NOT part of the product; ignore for implementation).

## Questions?
If anything is ambiguous, compare against `screens.jsx` — it is the ground truth. Measurements in this README are derived directly from that file.
