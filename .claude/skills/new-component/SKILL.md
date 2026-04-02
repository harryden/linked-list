---
name: new-component
description: Scaffold a new React component for this project — creates the component file with correct imports, Shadcn/Tailwind conventions, and a matching test file.
---

# New Component

`/new-component <ComponentName> [description]`

Create two files:

1. **`src/components/<ComponentName>.tsx`**
2. **`src/__tests__/ui/<ComponentName>.test.tsx`**

## Component template

```tsx
import { cn } from "@/lib/utils";

interface <ComponentName>Props {
  className?: string;
}

export default function <ComponentName>({ className }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>
      {/* TODO: implement */}
    </div>
  );
}
```

## Test template

```tsx
import { render } from "@testing-library/react";
import <ComponentName> from "@/components/<ComponentName>";

// describe/it/expect are Vitest globals (globals: true in vitest.config.ts) — no import needed
describe("<ComponentName>", () => {
  it("renders without crashing", () => {
    const { container } = render(<ComponentName />);
    expect(container).toBeTruthy();
  });
});
```

## Conventions

- Use Shadcn/UI primitives from `@/components/ui/` where appropriate
- Tailwind for all styling — no inline styles
- Use `cn()` from `@/lib/utils` for conditional class merging
- Props interface always named `<ComponentName>Props`
- Export as default export
- If the component fetches data, use a hook from `useSupabaseData.ts` — don't call Supabase directly

After creating both files, run `npm run test:run` to confirm the test passes.
