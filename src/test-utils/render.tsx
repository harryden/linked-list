import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { vi } from 'vitest';

type QueryResult = {
  data: unknown;
  error: unknown;
};

const createQuery = (overrides?: {
  baseResult?: QueryResult;
  singleResult?: QueryResult;
  maybeSingleResult?: QueryResult;
}) => {
  const baseResult = overrides?.baseResult ?? { data: [], error: null };
  const singleResult = overrides?.singleResult ?? { data: null, error: null };
  const maybeSingleResult = overrides?.maybeSingleResult ?? { data: null, error: null };

  const query: any = {};

  query.select = vi.fn().mockReturnValue(query);
  query.insert = vi.fn().mockReturnValue(query);
  query.update = vi.fn().mockReturnValue(query);
  query.delete = vi.fn().mockReturnValue(query);
  query.eq = vi.fn().mockReturnValue(query);
  query.order = vi.fn().mockReturnValue(query);
  query.limit = vi.fn().mockReturnValue(query);
  query.single = vi.fn().mockResolvedValue(singleResult);
  query.maybeSingle = vi.fn().mockResolvedValue(maybeSingleResult);

  const promise = Promise.resolve(baseResult);
  query.then = promise.then.bind(promise);
  query.catch = promise.catch.bind(promise);
  query.finally = promise.finally.bind(promise);

  return query;
};

vi.mock('@/integrations/supabase/client', () => {
  const queryFn = vi.fn(() => createQuery());
  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_test' } }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user_test' } } }, error: null }),
        signInWithOAuth: vi.fn(),
        signOut: vi.fn(),
      },
      from: queryFn,
    },
  };
});

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/' }: { route?: string } = {},
) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={qc}>
        <TooltipProvider>
          {ui}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
