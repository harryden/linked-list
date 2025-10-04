import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import './src/test-utils/msw';
import { resetSupabaseStub } from './src/test-utils/supabase';

globalThis.import = { meta: { env: {
  VITE_SUPABASE_URL: 'https://supabase.test',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'anon-key',
}}} as any;

beforeEach(() => {
  resetSupabaseStub();
});
