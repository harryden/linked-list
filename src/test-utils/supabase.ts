import { vi } from "vitest";

type SupabaseQueryResult = {
  data: unknown;
  error: unknown;
};

type QueryOverrides = {
  baseResult?: SupabaseQueryResult;
  singleResult?: SupabaseQueryResult;
  maybeSingleResult?: SupabaseQueryResult;
};

export const createQueryStub = (overrides?: QueryOverrides) => {
  const baseResult = overrides?.baseResult ?? { data: [], error: null };
  const singleResult = overrides?.singleResult ?? { data: null, error: null };
  const maybeSingleResult = overrides?.maybeSingleResult ?? {
    data: null,
    error: null,
  };

  const query: any = {};

  query.select = vi.fn().mockReturnValue(query);
  query.insert = vi.fn().mockReturnValue(query);
  query.update = vi.fn().mockReturnValue(query);
  query.delete = vi.fn().mockReturnValue(query);
  query.eq = vi.fn().mockReturnValue(query);
  query.order = vi.fn().mockReturnValue(query);
  query.limit = vi.fn().mockReturnValue(query);
  query.range = vi.fn().mockReturnValue(query);

  const promise = Promise.resolve(baseResult);
  query.then = promise.then.bind(promise);
  query.catch = promise.catch.bind(promise);
  query.finally = promise.finally.bind(promise);

  query.single = vi.fn().mockResolvedValue(singleResult);
  query.maybeSingle = vi.fn().mockResolvedValue(maybeSingleResult);

  return query;
};

export const supabaseStub = {
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi
      .fn()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
  from: vi.fn(),
};

export const resetSupabaseStub = () => {
  supabaseStub.auth.getUser.mockReset();
  supabaseStub.auth.getSession.mockReset();
  supabaseStub.auth.signInWithOAuth.mockReset();
  supabaseStub.auth.signOut.mockReset();
  supabaseStub.auth.onAuthStateChange.mockReset();
  supabaseStub.from.mockReset();

  supabaseStub.auth.getUser.mockResolvedValue({
    data: { user: { id: "user_test" } },
    error: null,
  });
  supabaseStub.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: "user_test" } } },
    error: null,
  });
  supabaseStub.auth.signInWithOAuth.mockResolvedValue({
    data: null,
    error: null,
  });
  supabaseStub.auth.signOut.mockResolvedValue({ error: null });
  supabaseStub.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });

  supabaseStub.from.mockImplementation(() => createQueryStub());
};

resetSupabaseStub();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseStub,
}));
