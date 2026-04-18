import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventPage from "@/pages/EventPage";
import { TEXT } from "@/constants/text";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const baseEvent = {
  id: "event-1",
  slug: "launch-day",
  name: "Launch Day",
  organizer_id: "organizer-1",
  starts_at: "2025-05-01T09:00:00.000Z",
  ends_at: "2025-05-01T11:00:00.000Z",
  location: "Gothenburg, Sweden",
};

const organizerProfile = {
  id: "organizer-1",
  name: "Organizer One",
  headline: "Host",
};
const attendanceRecord = [{ id: "attendance-1" }];

/**
 * Sets up Supabase mocks for the check-in arrival tests.
 *
 * isAttending=true  → user already attending, full page renders immediately
 * isAttending=false → user not attending; after insert succeeds, the
 *                     invalidated attendances refetch returns a record so
 *                     canViewAttendees flips to true and the full page renders
 */
const setupMocks = ({ isAttending }: { isAttending: boolean }) => {
  supabaseStub.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: "attendee-1" } } },
    error: null,
  });

  const eventQuery = createQueryStub({
    singleResult: { data: baseEvent, error: null },
  });
  eventQuery.select.mockReturnValue(eventQuery);
  eventQuery.eq.mockReturnValue(eventQuery);

  const profileQuery = createQueryStub({
    maybeSingleResult: { data: organizerProfile, error: null },
  });
  profileQuery.select.mockReturnValue(profileQuery);
  profileQuery.eq.mockReturnValue(profileQuery);

  // Track whether the join insert has been called so refetches can return data
  let insertCalled = false;

  const makeAttendancesQuery = (data: unknown[]) => {
    const q = createQueryStub({ baseResult: { data, error: null } });
    q.select.mockReturnValue(q);
    q.eq.mockReturnValue(q);
    q.insert = vi.fn().mockImplementation(() => {
      insertCalled = true;
      return createQueryStub({ baseResult: { data: null, error: null } });
    });
    return q;
  };

  supabaseStub.from.mockImplementation((table: string) => {
    if (table === "events") return eventQuery;
    if (table === "profiles") return profileQuery;

    if (table === "attendances") {
      const hasAttendance = isAttending || insertCalled;
      return makeAttendancesQuery(hasAttendance ? attendanceRecord : []);
    }

    return createQueryStub();
  });
};

const renderEventPage = () =>
  renderWithProviders(
    <Routes>
      <Route path="/event/:slug" element={<EventPage />} />
    </Routes>,
    { route: "/event/launch-day" },
  );

describe("EventPage check-in arrival moment", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("does not show the welcome banner on a plain page load", async () => {
    setupMocks({ isAttending: true });
    renderEventPage();

    await screen.findByText(baseEvent.name);

    expect(
      screen.queryByText(TEXT.event.page.checkInSuccessBanner),
    ).not.toBeInTheDocument();
  });

  it("shows the welcome banner after a successful check-in", async () => {
    setupMocks({ isAttending: false });
    renderEventPage();

    const checkInButton = await screen.findByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });

    await userEvent.click(checkInButton);

    await waitFor(() => {
      expect(
        screen.getByText(TEXT.event.page.checkInSuccessBanner),
      ).toBeInTheDocument();
    });
  });

  it("dismisses the banner when the X button is clicked", async () => {
    setupMocks({ isAttending: false });
    renderEventPage();

    const checkInButton = await screen.findByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });
    await userEvent.click(checkInButton);

    const dismissButton = await screen.findByRole("button", {
      name: "Dismiss",
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(
        screen.queryByText(TEXT.event.page.checkInSuccessBanner),
      ).not.toBeInTheDocument();
    });
  });

  it("scrolls to the attendee list after attendee data loads", async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    setupMocks({ isAttending: false });
    renderEventPage();

    const checkInButton = await screen.findByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });
    await userEvent.click(checkInButton);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });
  });
});
