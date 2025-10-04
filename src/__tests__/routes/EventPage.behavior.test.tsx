import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test-utils/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventPage from "@/pages/EventPage";
import { TEXT } from "@/constants/text";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type OrganizerProfile = {
  id: string;
  name: string;
  headline?: string | null;
};

type LocationMocksOptions = {
  event: any;
  currentUserId: string | null;
  userAttendance?: unknown[];
  attendeeProfiles?: OrganizerProfile[];
  organizerProfile?: OrganizerProfile | null;
  deleteResult?: { data: unknown; error: unknown };
  resolveEventWith?: "immediate" | "deferred";
};

const setupEventPageMocks = ({
  event,
  currentUserId,
  userAttendance = [],
  attendeeProfiles = [],
  organizerProfile = {
    id: event.organizer_id ?? "organizer-1",
    name: "Organizer One",
    headline: "Event Host",
  },
  deleteResult = { data: null, error: null },
  resolveEventWith = "immediate",
}: LocationMocksOptions) => {
  supabaseStub.auth.getSession.mockResolvedValue({
    data: currentUserId
      ? { session: { user: { id: currentUserId } } }
      : { session: null },
    error: null,
  });

  const eventQuery = createQueryStub({
    singleResult: { data: event, error: null },
  });
  eventQuery.select.mockReturnValue(eventQuery);
  eventQuery.eq.mockReturnValue(eventQuery);

  const deferred = createDeferred<{ data: typeof event; error: null }>();
  if (resolveEventWith === "deferred") {
    eventQuery.single.mockReturnValue(deferred.promise);
  }

  const userAttendanceQuery = createQueryStub({
    baseResult: { data: userAttendance, error: null },
  });
  userAttendanceQuery.select.mockReturnValue(userAttendanceQuery);
  userAttendanceQuery.eq.mockReturnValue(userAttendanceQuery);

  const attendeesQuery = createQueryStub({
    baseResult: {
      data: attendeeProfiles.map((profile) => ({ profiles: profile })),
      error: null,
    },
  });
  attendeesQuery.select.mockReturnValue(attendeesQuery);
  attendeesQuery.eq.mockReturnValue(attendeesQuery);

  const profileQuery = createQueryStub({
    maybeSingleResult: { data: organizerProfile, error: null },
  });
  profileQuery.select.mockReturnValue(profileQuery);
  profileQuery.eq.mockReturnValue(profileQuery);

  const deleteQuery = createQueryStub({
    baseResult: deleteResult,
    maybeSingleResult: deleteResult,
  });
  deleteQuery.delete.mockReturnValue(deleteQuery);
  deleteQuery.eq.mockReturnValue(deleteQuery);
  deleteQuery.select.mockReturnValue(deleteQuery);

  let eventCallCount = 0;
  let attendanceCallCount = 0;

  supabaseStub.from.mockImplementation((table) => {
    if (table === "events") {
      if (eventCallCount === 0) {
        eventCallCount += 1;
        return eventQuery;
      }
      return deleteQuery;
    }

    if (table === "attendances") {
      attendanceCallCount += 1;
      if (attendanceCallCount === 1) {
        return userAttendanceQuery;
      }
      return attendeesQuery;
    }

    if (table === "profiles") {
      return profileQuery;
    }

    return createQueryStub();
  });

  return { deferred };
};

describe("EventPage behavior", () => {
  const renderEventPage = () =>
    renderWithProviders(
      <Routes>
        <Route path="/event/:slug" element={<EventPage />} />
        <Route
          path="/dashboard"
          element={<div data-testid="dashboard-destination" />}
        />
      </Routes>,
      { route: "/event/launch-day" },
    );

  const baseEvent = {
    id: "event-1",
    slug: "launch-day",
    name: "Launch Day",
    organizer_id: "organizer-1",
    starts_at: "2025-05-01T09:00:00.000Z",
    ends_at: "2025-05-01T11:00:00.000Z",
    location: "Gothenburg, Sweden",
  };

  it("renders the skeleton before the event data resolves and then shows the event view", async () => {
    const { deferred } = setupEventPageMocks({
      event: baseEvent,
      currentUserId: "attendee-1",
      userAttendance: [{ id: "attendance-1" }],
      attendeeProfiles: [
        { id: "attendee-1", name: "Guest One", headline: "Attendee" },
      ],
      resolveEventWith: "deferred",
    });

    renderEventPage();

    expect(screen.getByText(TEXT.event.page.loading)).toBeInTheDocument();

    deferred.resolve({ data: baseEvent, error: null });

    expect(await screen.findByText(baseEvent.name)).toBeInTheDocument();
  });

  it("exposes owner controls and hides the attend button when viewing own event", async () => {
    setupEventPageMocks({
      event: baseEvent,
      currentUserId: "organizer-1",
      userAttendance: [],
      attendeeProfiles: [],
    });

    renderEventPage();

    expect(await screen.findByText(baseEvent.name)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TEXT.common.buttons.viewQrCode }),
    ).toBeInTheDocument();

    const user = userEvent.setup();
    const optionsTrigger = screen.getByLabelText(TEXT.event.header.options);
    await user.click(optionsTrigger);

    expect(await screen.findByText(TEXT.event.header.edit)).toBeInTheDocument();
    expect(screen.getByText(TEXT.event.header.delete)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: TEXT.event.attendButton.checkIn }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: TEXT.event.attendButton.checkInLinkedIn,
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps the guest view minimal until the attendee joins", async () => {
    setupEventPageMocks({
      event: baseEvent,
      currentUserId: "guest-1",
      userAttendance: [],
      attendeeProfiles: [],
    });

    renderEventPage();

    expect(
      await screen.findByText(TEXT.event.page.guestNotice),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(TEXT.common.buttons.viewQrCode),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: TEXT.event.attendButton.checkInLinkedIn,
      }),
    ).toBeInTheDocument();
  });

  it("completes the delete flow, shows feedback, and redirects to the dashboard", async () => {
    setupEventPageMocks({
      event: baseEvent,
      currentUserId: "organizer-1",
      userAttendance: [],
      attendeeProfiles: [],
    });

    renderEventPage();

    const optionsTrigger = await screen.findByLabelText(
      TEXT.event.header.options,
    );
    const user = userEvent.setup();

    await user.click(optionsTrigger);
    await user.click(screen.getByText(TEXT.event.header.delete));

    await user.click(
      await screen.findByRole("button", {
        name: TEXT.event.header.deleteConfirmSubmit,
      }),
    );

    expect(
      await screen.findByText(TEXT.event.toast.deleteSuccess),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("dashboard-destination"),
    ).toBeInTheDocument();
  });

  it("renders the not-found view when the event cannot be loaded", async () => {
    supabaseStub.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "guest-1" } } },
      error: null,
    });

    const failingQuery = createQueryStub({
      singleResult: { data: null, error: { message: "Gone" } },
    });
    failingQuery.select.mockReturnValue(failingQuery);
    failingQuery.eq.mockReturnValue(failingQuery);

    supabaseStub.from.mockImplementation((table) => {
      if (table === "events") {
        return failingQuery;
      }
      return createQueryStub();
    });

    renderEventPage();

    expect(
      await screen.findByText(TEXT.event.page.notFoundTitle),
    ).toBeInTheDocument();
  });
});
