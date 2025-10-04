import '@testing-library/jest-dom';
import './src/test-utils/msw';

globalThis.import = { meta: { env: {
  VITE_SUPABASE_URL: 'https://supabase.test',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'anon-key',
}}} as any;
