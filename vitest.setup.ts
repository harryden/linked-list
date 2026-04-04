import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, beforeEach } from "vitest";
import "./src/test-utils/msw";
import { resetSupabaseStub } from "./src/test-utils/supabase";

expect.extend(matchers);

globalThis.import = {
  meta: {
    env: {
      VITE_PUBLIC_SUPABASE_URL: "https://supabase.test",
      VITE_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    },
  },
} as any;

beforeEach(() => {
  resetSupabaseStub();
});
