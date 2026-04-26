import type { Page, Route } from "@playwright/test";

const SUPABASE_URL =
  process.env.VITE_PUBLIC_SUPABASE_URL ?? "https://dummy.supabase.co";

const getStorageHost = (url: string) => {
  try {
    return new URL(url).hostname.split(".")[0] || "dummy";
  } catch {
    return "dummy";
  }
};

const storageKey = `sb-${getStorageHost(SUPABASE_URL)}-auth-token`;

export type MockUser = {
  id: string;
  email: string;
  name: string;
  headline?: string | null;
  linkedin_id?: string | null;
  avatar_url?: string | null;
};

export type MockEvent = {
  id: string;
  slug: string;
  name: string;
  organizer_id: string;
  short_code?: string | null;
  location?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  linkedin_event_url?: string | null;
  created_at?: string;
};

export type MockAttendance = {
  id?: string;
  event_id: string;
  user_id: string;
  source?: string | null;
  created_at?: string;
};

type MockSupabaseOptions = {
  sessionUser?: MockUser | null;
  users?: MockUser[];
  events?: MockEvent[];
  attendances?: MockAttendance[];
};

type MockState = {
  sessionUser: MockUser | null;
  users: MockUser[];
  events: MockEvent[];
  attendances: MockAttendance[];
};

const nowIso = () => new Date().toISOString();

const defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type, prefer",
};

const makeSession = (user: MockUser) => ({
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: {
    id: user.id,
    email: user.email,
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {
      provider: "linkedin_oidc",
      providers: ["linkedin_oidc"],
    },
    user_metadata: {
      full_name: user.name,
    },
  },
});

const asProfile = (user: MockUser) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  headline: user.headline ?? null,
  linkedin_id: user.linkedin_id ?? null,
  avatar_url: user.avatar_url ?? null,
});

const asAuthUser = (user: MockUser) => ({
  id: user.id,
  email: user.email,
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {
    provider: "linkedin_oidc",
    providers: ["linkedin_oidc"],
  },
  user_metadata: {
    full_name: user.name,
  },
});

const parseFilter = (url: URL, key: string) => {
  const value = url.searchParams.get(key);
  if (!value?.startsWith("eq.")) return undefined;
  return decodeURIComponent(value.slice(3));
};

const wantsSingleObject = (route: Route) =>
  route
    .request()
    .headers()
    .accept?.includes("application/vnd.pgrst.object+json") ?? false;

const fulfillJson = async (
  route: Route,
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: { ...defaultHeaders, ...extraHeaders },
    body: JSON.stringify(body),
  });

const fulfillNoContent = async (route: Route) =>
  route.fulfill({
    status: 204,
    headers: defaultHeaders,
    body: "",
  });

const nextEventId = (count: number) =>
  `00000000-0000-4000-8000-${String(count + 1).padStart(12, "0")}`;

const nextAttendanceId = (count: number) =>
  `attendance-${String(count + 1).padStart(4, "0")}`;

const findEvent = (state: MockState, eventId: string) =>
  state.events.find((event) => event.id === eventId) ?? null;

const findUser = (state: MockState, userId: string) =>
  state.users.find((user) => user.id === userId) ?? null;

const withDefaults = (options: MockSupabaseOptions): MockState => {
  const uniqueUsers = new Map<string, MockUser>();

  if (options.sessionUser) {
    uniqueUsers.set(options.sessionUser.id, options.sessionUser);
  }

  for (const user of options.users ?? []) {
    uniqueUsers.set(user.id, user);
  }

  return {
    sessionUser: options.sessionUser ?? null,
    users: [...uniqueUsers.values()],
    events: (options.events ?? []).map((event) => ({
      ...event,
      short_code: event.short_code ?? null,
      location: event.location ?? null,
      starts_at: event.starts_at ?? null,
      ends_at: event.ends_at ?? null,
      linkedin_event_url: event.linkedin_event_url ?? null,
      created_at: event.created_at ?? nowIso(),
    })),
    attendances: (options.attendances ?? []).map((attendance, index) => ({
      ...attendance,
      id: attendance.id ?? nextAttendanceId(index),
      source: attendance.source ?? "manual",
      created_at: attendance.created_at ?? nowIso(),
    })),
  };
};

const handleAuthRequest = async (route: Route, state: MockState) => {
  const requestUrl = new URL(route.request().url());

  if (route.request().method() === "OPTIONS") {
    await fulfillNoContent(route);
    return;
  }

  if (requestUrl.pathname.endsWith("/user")) {
    if (!state.sessionUser) {
      await fulfillJson(route, { message: "Auth session missing!" }, 401);
      return;
    }

    await fulfillJson(route, asAuthUser(state.sessionUser));
    return;
  }

  if (requestUrl.pathname.endsWith("/logout")) {
    state.sessionUser = null;
    await fulfillJson(route, {});
    return;
  }

  await fulfillJson(route, {}, 200);
};

const handleProfilesRequest = async (route: Route, state: MockState) => {
  if (route.request().method() === "OPTIONS") {
    await fulfillNoContent(route);
    return;
  }

  const url = new URL(route.request().url());
  const id = parseFilter(url, "id");
  const profile = id ? findUser(state, id) : null;
  const body = profile ? asProfile(profile) : null;

  if (wantsSingleObject(route)) {
    await fulfillJson(route, body);
    return;
  }

  await fulfillJson(route, body ? [body] : []);
};

const handleEventsRequest = async (route: Route, state: MockState) => {
  const request = route.request();
  const url = new URL(request.url());

  if (request.method() === "OPTIONS") {
    await fulfillNoContent(route);
    return;
  }

  if (request.method() === "POST") {
    const payload = request.postDataJSON() as Partial<MockEvent>;
    const created = {
      id: payload.id ?? nextEventId(state.events.length),
      slug: payload.slug ?? "generated-event",
      name: payload.name ?? "Generated event",
      organizer_id: payload.organizer_id ?? state.sessionUser?.id ?? "unknown",
      short_code: payload.short_code ?? "AB12CD",
      location: payload.location ?? null,
      starts_at: payload.starts_at ?? null,
      ends_at: payload.ends_at ?? null,
      linkedin_event_url: payload.linkedin_event_url ?? null,
      created_at: nowIso(),
    };

    state.events.unshift(created);
    await fulfillJson(
      route,
      wantsSingleObject(route) ? created : [created],
      201,
    );
    return;
  }

  let events = [...state.events];
  const slug = parseFilter(url, "slug");
  const organizerId = parseFilter(url, "organizer_id");
  const shortCode = parseFilter(url, "short_code");
  const id = parseFilter(url, "id");

  if (slug) events = events.filter((event) => event.slug === slug);
  if (organizerId) {
    events = events.filter((event) => event.organizer_id === organizerId);
  }
  if (shortCode) {
    events = events.filter((event) => event.short_code === shortCode);
  }
  if (id) events = events.filter((event) => event.id === id);

  events.sort((a, b) =>
    a.created_at && b.created_at ? b.created_at.localeCompare(a.created_at) : 0,
  );

  if (wantsSingleObject(route)) {
    await fulfillJson(route, events[0] ?? null);
    return;
  }

  await fulfillJson(route, events);
};

const handleAttendancesRequest = async (route: Route, state: MockState) => {
  const request = route.request();
  const url = new URL(request.url());

  if (request.method() === "OPTIONS") {
    await fulfillNoContent(route);
    return;
  }

  if (request.method() === "POST") {
    const payload = request.postDataJSON() as Partial<MockAttendance>;
    if (!payload.event_id || !payload.user_id) {
      await fulfillJson(
        route,
        { error: "Attendance requires event_id and user_id" },
        400,
      );
      return;
    }

    const created = {
      id: payload.id ?? nextAttendanceId(state.attendances.length),
      event_id: payload.event_id,
      user_id: payload.user_id,
      source: payload.source ?? "manual",
      created_at: nowIso(),
    };

    state.attendances.unshift(created);
    await fulfillJson(
      route,
      wantsSingleObject(route) ? created : [created],
      201,
    );
    return;
  }

  let attendances = [...state.attendances];
  const eventId = parseFilter(url, "event_id");
  const userId = parseFilter(url, "user_id");

  if (eventId) {
    attendances = attendances.filter(
      (attendance) => attendance.event_id === eventId,
    );
  }
  if (userId) {
    attendances = attendances.filter(
      (attendance) => attendance.user_id === userId,
    );
  }

  const select = url.searchParams.get("select") ?? "";
  const includeProfiles = select.includes("profiles(");
  const includeEvents = select.includes("events(");

  const body = attendances.map((attendance) => ({
    ...attendance,
    ...(includeProfiles
      ? {
          profiles: (() => {
            const user = findUser(state, attendance.user_id);
            return user ? asProfile(user) : null;
          })(),
        }
      : {}),
    ...(includeEvents ? { events: findEvent(state, attendance.event_id) } : {}),
  }));

  if (wantsSingleObject(route)) {
    await fulfillJson(route, body[0] ?? null);
    return;
  }

  await fulfillJson(route, body);
};

export const mockSupabase = async (
  page: Page,
  options: MockSupabaseOptions = {},
) => {
  const state = withDefaults(options);
  const session = state.sessionUser ? makeSession(state.sessionUser) : null;

  await page.addInitScript(
    ({ key, seededSession }) => {
      if (seededSession) {
        window.localStorage.setItem(key, JSON.stringify(seededSession));
      } else {
        window.localStorage.removeItem(key);
      }
    },
    { key: storageKey, seededSession: session },
  );

  await page.route(`${SUPABASE_URL}/auth/v1/**`, async (route) => {
    await handleAuthRequest(route, state);
  });

  await page.route(`${SUPABASE_URL}/rest/v1/**`, async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname.endsWith("/profiles")) {
      await handleProfilesRequest(route, state);
      return;
    }

    if (pathname.endsWith("/events")) {
      await handleEventsRequest(route, state);
      return;
    }

    if (pathname.endsWith("/attendances")) {
      await handleAttendancesRequest(route, state);
      return;
    }

    const request = route.request();
    await fulfillJson(
      route,
      {
        error: "Unhandled Supabase REST mock request",
        request: {
          method: request.method(),
          url: request.url(),
          headers: request.headers(),
        },
      },
      500,
    );
  });

  return state;
};
