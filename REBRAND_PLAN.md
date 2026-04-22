# Design Proposal: Linked List Rebrand

This document outlines the strategic and technical plan to transition from the current "LinkBack" / "Linked List" mixed identity to a unified brand built around the new **LinkedList** visual system.

## 1. Brand Identity & Naming

*   **Primary Brand Name:** Linked List
*   **Logo/Technical Lockup:** LinkedList (PascalCase)
*   **Domain:** thelinkedlist.xyz
*   **Core Value Prop:** "The guest list, rebuilt as a network."

## 2. Visual System

### Core Color: Medium Violet
The current neutral/black system will be anchored by a sophisticated violet accent.
*   **Hex:** `#7c4dc4`
*   **HSL:** `264, 54%, 54%` (approximate)
*   **Usage:** Primary buttons, logo mark, active states, and focus rings.

### Logo Mark: "L-Check"
The new symbol merges a capital 'L' with a checkmark, symbolizing both "LinkedIn" and "Check-in."
*   **Typography:** Inter Light for the wordmark.
*   **Assets needed:** 
    *   `logo-mark.svg` (The L-Check symbol)
    *   `logo-full.svg` (Lockup with "LinkedList" wordmark)
    *   `favicon.png` (Derived from the L-Check)

## 3. Implementation Roadmap

### Phase 1: Foundation (Theme Update)
*   Update `src/index.css` to replace `--brand-accent` with the new Violet HSL values.
*   Refine `--brand-hover` to a deeper shade of violet.
*   Decide on the role of LinkedIn Blue (keep as secondary or replace with violet-blue).

### Phase 2: Asset Replacement
*   Replace the current `LogoMark.tsx` component with the new SVG implementation.
*   Update metadata in `index.html` and `vercel.json` (OpenGraph images).

### Phase 3: Content Audit
*   Update `src/constants/text.ts` to reflect the consistent use of "Linked List."
*   Update email templates in Supabase Edge Functions to use new branding and violet accents.

### Phase 4: Domain Migration
*   Update `APP_URL` environment variables.
*   Set up redirects from old domain if applicable.

---
**Status:** DRAFT / PROPOSAL
**Author:** Gemini CLI & Team
