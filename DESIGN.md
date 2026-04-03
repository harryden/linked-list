# LinkBack Design System

> "A backstage badge — the kind that gets you through the door at something that actually matters."

## Aesthetic

**Industrial/Utilitarian, refined.** The product lives at in-person professional events. It should feel like the credential that gets you in — not a SaaS dashboard, not a consumer app. Dense, intentional, confident. Dark by default.

---

## Color

All tokens are defined as HSL in `src/index.css`. The palette has a warm near-black base — not pure void, not cold tech-grey.

| Role                | Token                    | HSL           | Hex       |
| ------------------- | ------------------------ | ------------- | --------- |
| Background          | `--background`           | `30 5% 6%`    | `#0F0F0E` |
| Surface / Card      | `--card`                 | `30 4% 11%`   | `#1C1B19` |
| Surface elevated    | `--popover`              | `30 4% 14%`   | `#242220` |
| Border / Divider    | `--border`               | `30 4% 18%`   | `#2E2C29` |
| Input               | `--input`                | `30 4% 18%`   | `#2E2C29` |
| Primary text        | `--foreground`           | `35 10% 95%`  | `#F2EFE9` |
| Muted text          | `--muted-foreground`     | `30 5% 43%`   | `#6B6760` |
| Muted background    | `--muted`                | `30 4% 14%`   | `#242220` |
| Accent / CTA        | `--primary`              | `77 100% 63%` | `#BEF264` |
| Accent text         | `--primary-foreground`   | `30 5% 6%`    | `#0F0F0E` |
| Secondary action    | `--secondary`            | `30 4% 18%`   | `#2E2C29` |
| Secondary text      | `--secondary-foreground` | `35 10% 95%`  | `#F2EFE9` |
| Accent surface      | `--accent`               | `30 4% 18%`   | `#2E2C29` |
| Accent surface text | `--accent-foreground`    | `35 10% 95%`  | `#F2EFE9` |
| Destructive         | `--destructive`          | `0 72% 51%`   | standard  |
| Success             | `--success`              | `142 76% 36%` | standard  |
| LinkedIn brand      | `--brand-linkedin`       | `210 77% 40%` | standard  |

**The chartreuse accent (`#BEF264`)** is used sparingly — primary CTAs, active states, checked-in badge. Everywhere else the UI stays dark and neutral. Color is rare and meaningful.

---

## Typography

| Role           | Font                | Weight           | Notes                                               |
| -------------- | ------------------- | ---------------- | --------------------------------------------------- |
| Display / Hero | **Cabinet Grotesk** | Black (900)      | Wide, confident — via Fontshare                     |
| Body / UI      | **Geist**           | Regular / Medium | Clean, slightly technical — via Fontsource          |
| Data / Mono    | **Geist Mono**      | Regular          | Event codes, QR screen, timestamps — via Fontsource |

**Loading:** via `@fontsource/geist`, `@fontsource/geist-mono`, and Cabinet Grotesk from Fontshare CDN in `index.html`.

**Scale (Tailwind defaults apply):**

- Hero headline: `text-5xl` / `text-6xl`, Cabinet Grotesk Black
- Section heading: `text-2xl` / `text-3xl`, Cabinet Grotesk Bold
- Body: `text-base`, Geist Regular
- Label / caption: `text-sm`, Geist Medium
- Event code / QR: `text-4xl` / `text-5xl`, Geist Mono

---

## Spacing & Layout

- **Base unit:** 4px (Tailwind default)
- **Density:** medium-tight. This is a functional tool, not a marketing site. Breathe where it matters (event name, QR code), compress where it doesn't (attendee list rows, metadata).
- **Border radius:** `--radius: 0.375rem` (6px) — intentional, not bubbly. Cards and buttons are squarer than shadcn defaults.
- **Max content width:** `max-w-2xl` for forms, `max-w-4xl` for dashboard lists, full-width for QR screen.

---

## Motion

**Minimal-functional.** Transitions that aid comprehension only.

- State transitions: `150ms ease-out`
- Page entry: `200ms ease-out` fade
- QR screen: no animation — static and confident
- No bounce, no spring, no scroll-driven choreography

---

## Key Screen Decisions

### Landing page

- Dark background throughout — no white sections
- Hero: full-width, Cabinet Grotesk Black headline left-aligned (not centered), chartreuse CTA button
- No 3-column icon grid. Replace with 2 strong statements or a single product illustration
- No glowing gradient text

### Event list (Dashboard)

- Dense table rows: date | event name | attendee count | status
- No cards, no rounded-2xl boxes
- Active events get a chartreuse dot or status label
- Hover state: subtle `--border` background lift

### QR check-in screen

- Full-bleed dark background, no navigation chrome
- Event name in Cabinet Grotesk Black, large
- QR code centered, generous padding
- Event code in Geist Mono below the QR
- Live timestamp ticking in Geist Mono, muted
- Feels like a boarding pass

### Auth page

- Dark card on dark background
- LinkedIn button retains brand blue — it's a trust signal, don't override it
- Minimal copy

### Forms (Create event, Join event)

- Input fields: `--input` background with `--border` border
- Labels: Geist Medium, `--muted-foreground`
- Error states: destructive red as before
- Submit button: chartreuse primary

---

## Anti-patterns (never reintroduce)

- Glowing `textShadow` on headlines
- `rounded-full` pill buttons as the default shape
- 3-column feature grid with icons in colored squares
- Hot pink / purple gradient accents
- `bg-gradient-subtle` as the page background
- Centered hero with equal padding on all sides

---

## Implementation notes

1. Update `src/index.css` — replace all HSL tokens with the values above
2. Update `tailwind.config.ts` — set `borderRadius.DEFAULT` to `0.375rem`, add font families
3. Load fonts in `index.html` — Cabinet Grotesk from Fontshare, Geist/Geist Mono via `@fontsource`
4. Update `--radius` to `0.375rem`
5. Rework `Landing.tsx` and its sub-components first (most visible)
6. QR screen (`EventPage.tsx` QR dialog / `EventSuccess.tsx`) second
7. Dashboard event list third
