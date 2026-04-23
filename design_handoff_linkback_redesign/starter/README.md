# Starter files — drop-in

These two files are ready to replace the existing ones in `linked-list/`:

| From handoff                 | Replace in repo      |
| ---------------------------- | -------------------- |
| `starter/src/index.css`      | `src/index.css`      |
| `starter/tailwind.config.ts` | `tailwind.config.ts` |

## Why

- All pink `--primary`, `--gradient-*`, `--glow-*`, shimmer, and border-glow tokens/utilities are removed.
- New semantic tokens (`bg-base`, `bg-surface`, `border-subtle`, `text-primary`, `text-secondary`, `brand-accent`, `state-success*`, `state-error*`) are wired to Tailwind and exposed via CSS variables.
- A compatibility layer remaps shadcn's legacy names (`--primary`, `--muted`, `--background`…) onto the new tokens, so existing shadcn components re-skin in place without renaming props.
- Geist + Geist Mono are set as the default font-families with proper OpenType feature settings (`cv02/03/04/11` for unambiguous characters and flat-top numerals).
- A global `:focus-visible` style produces the black halo + white offset ring prescribed in the spec.
- Reduced-motion is respected globally.
- The `fontSize` scale mirrors the spec exactly (`h1`…`caption`), with line-height/tracking/weight baked in — use `className="text-h1"` etc.

## Also required

After swapping the files above:

```bash
npm install @fontsource/geist-sans @fontsource/geist-mono framer-motion
```

In `src/main.tsx`, add:

```ts
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
```

Then proceed to step 3 of the build order in `README.md` (shadcn component re-skin).
