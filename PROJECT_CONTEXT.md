# Linked List

## Stack

- React, Vite, TypeScript
- Tailwind CSS, Radix UI
- TanStack Query
- Supabase (PostgreSQL, Realtime, Edge Functions)
- Vitest, Playwright

## Architecture

- **Frontend:** Suspense-driven lazy loading. React Query for server state. react-router-dom v6.
- **Backend:** Supabase PostgreSQL. LinkedIn OIDC. RLS policies on all tables. Change Data Capture streams `attendances` to client.
- **Edge Functions:** Deno. `send-event-confirmation` triggered by SQL Webhook.

## Conventions

- No comments. Self-documentary code only.
- Atomic commits. PRs required.
- Copilot review required before merge.
