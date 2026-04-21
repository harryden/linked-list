# LinkBack: Technical & Product Architecture

LinkBack is a professional networking and event check-in platform designed to eliminate the friction of event registration through verified LinkedIn identities and real-time attendee synchronization.

---

## 1. Product Vision & Strategy

The core value proposition of LinkBack is **"Verified Presence."**

- **Frictionless Entry:** No manual forms. One-tap LinkedIn OAuth check-in.
- **Verified Identity:** Attendee data (names, headlines, avatars) is pulled directly from LinkedIn, ensuring high-quality networking.
- **Real-time Networking:** A "Live Room" feel where the attendee list grows dynamically as people scan into the event.
- **Organizer Insights:** One-click CSV exports of verified professional contacts.

---

## 2. Technical Stack Deep-Dive

### **Frontend: React & Vite**

- **Architecture:** Suspense-driven lazy loading for all pages to ensure LCP (Largest Contentful Paint) is minimal.
- **State Management:** **TanStack Query (React Query)** for server state, ensuring efficient caching, background refetching, and optimistic updates.
- **Routing:** `react-router-dom` v6 with intelligent redirect handling that preserves state through OAuth "handshakes."
- **Components:** Built on **Radix UI** primitives for accessibility, styled with **Tailwind CSS**. Custom UI components are stored in `src/components/ui`.

### **Backend: Supabase (PostgreSQL)**

- **Identity:** LinkedIn OIDC (OpenID Connect) integration.
- **Realtime (CDC):** Postgres Change Data Capture streams changes from the `attendances` table to the client-side `useRealtimeAttendances` hook.
- **Database Logic:**
  - **Short Codes:** Deterministic 6-digit codes generated from event UUIDs for fast manual entry.
  - **RLS (Row Level Security):** Strict security policies ensure:
    - Anonymous users can only see public event details (Slug/Location/Time).
    - Attendee lists are only visible to the Organizer or other Checked-in Attendees.
    - Feedback is write-only for privacy.
- **Edge Functions:** Deno-based functions (e.g., `send-event-confirmation`) triggered by SQL Webhooks to handle transactional emails via Resend.

---

## 3. Critical Infrastructure & DevOps

### **Domain & URL Intelligence**

LinkBack is built for **Multi-Domain flexibility**.

- **Location-Aware Logic:** The `getBaseUrl()` helper prioritizes the current `window.location.origin`. This allows the app to function identically on `vercel.app` subdomains, custom domains, or local dev environments without manual configuration.
- **Stable OAuth Handshaking:** The `getProductionUrl()` helper ensures that critical LinkedIn redirects always point back to a registered stable domain, regardless of which alias the user started on.

### **Security & Performance**

- **CSP (Content Security Policy):** A hardened policy in `vercel.json` protects against XSS while allowing specific external assets (LinkedIn Media, OpenStreetMap, Supabase).
- **Internationalization (i18n):** Deeply integrated `i18next` support for English (`en`) and Swedish (`sv`). Date formatting is location-aware using `date-fns`.

---

## 4. Engineering Standards & Quality Assurance

### **Test Methodology**

- **Unit & Integration:** 120+ tests in **Vitest**. Focuses on date-time math, URL formation, and component contract testing (ensuring UI components expose correct ARIA roles).
- **End-to-End (E2E):** **Playwright** suite covering the "Happy Path":
  1. Landing Page -> Auth.
  2. Event Creation -> Dashboard.
  3. QR/Short Code Entry -> Check-in -> Networking List.
- **Accessibility (a11y):** Accessibility "sanity checks" integrated into the test suite to ensure the app remains usable for screen readers (semantic headings, ARIA descriptions).

### **Repository Conventions**

- **No Comments Policy:** Code must be self-documentary. Complex logic is abstracted into cleanly named helpers rather than explained via comments.
- **Atomic Commits:** Every commit represents one logical change. Commits are pushed and reviewed via PRs.
- **GitHub Copilot Review:** No PR is merged until the Copilot automated review has been processed and addressed.

---

## 5. Visual Identity (UI/UX)

- **Palette:** Soft violets, electric blues, and deep slates.
- **Gradients:** Uses a custom `bg-gradient-subtle` and `shadow-glow-primary` to create a "glassmorphism" light-mode feel.
- **Feedback Loop:** A persistent "Feedback" floating button ensures that product-market fit is driven by direct user input.
