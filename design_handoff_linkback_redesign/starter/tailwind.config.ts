import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * LinkBack — Precision Utility
 *
 * Ships the monochrome token system. Semantic names (bg-surface, text-primary,
 * border-subtle…) are the preferred API. shadcn-legacy names (primary,
 * secondary, muted…) remain wired up via the `--*` compatibility layer in
 * src/index.css so existing Radix/shadcn components re-skin in place.
 *
 * Gradients, glow shadows, shimmer, and border-glow animations intentionally
 * removed — they were part of the old aesthetic.
 */
export default {
  darkMode: ["class"], // dark mode deferred to v2; tokens are inversion-ready
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        lg: "1024px", // max container — design does not stretch wider
      },
    },
    extend: {
      colors: {
        /* ── Semantic tokens (preferred) ── */
        "bg-base":           "hsl(var(--bg-base))",
        "bg-surface":        "hsl(var(--bg-surface))",
        "bg-surface-hover":  "hsl(var(--bg-surface-hover))",
        "border-subtle":     "hsl(var(--border-subtle))",
        "border-strong":     "hsl(var(--border-strong))",
        "text-primary":      "hsl(var(--text-primary))",
        "text-secondary":    "hsl(var(--text-secondary))",
        "brand-accent":      "hsl(var(--brand-accent))",
        "brand-hover":       "hsl(var(--brand-hover))",
        "state-success":     "hsl(var(--state-success))",
        "state-success-bg":  "hsl(var(--state-success-bg))",
        "state-error":       "hsl(var(--state-error))",
        "state-error-bg":    "hsl(var(--state-error-bg))",

        /* ── shadcn-legacy aliases ──
           Kept so existing <Button variant="primary"> etc. keep working. */
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:     "hsl(var(--primary))",
          foreground:  "hsl(var(--primary-foreground))",
          hover:       "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        linkedin: {
          DEFAULT: "hsl(var(--brand-linkedin))",
          hover:   "hsl(var(--brand-linkedin-hover))",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        /* [size, { lineHeight, letterSpacing, fontWeight }] */
        h1:       ["2.25rem", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "600" }],
        h2:       ["1.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.01em", fontWeight: "600" }],
        h3:       ["1.25rem", { lineHeight: "1.3",  letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-lg":    ["1rem",     { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        body:         ["0.875rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "body-medium":["0.875rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" }],
        caption:      ["0.75rem",  { lineHeight: "1.4", letterSpacing: "0", fontWeight: "400" }],
      },
      spacing: {
        /* 4px grid — explicit named stops */
        0.5: "2px",
        1:   "4px",
        2:   "8px",
        3:   "12px",
        4:   "16px",
        6:   "24px",
        8:   "32px",
        12:  "48px",
        16:  "64px",
        24:  "96px",
      },
      borderRadius: {
        sm:   "4px",
        DEFAULT: "6px",
        md:   "6px",
        lg:   "12px",
        xl:   "12px",
        full: "9999px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        out:    "var(--ease-out)",
      },
      transitionDuration: {
        fast: "150ms",
        med:  "300ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 150ms var(--ease-spring)",
        "pulse-subtle":   "pulse-subtle 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
