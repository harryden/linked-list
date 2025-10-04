import { renderWithProviders } from "@/test-utils/render";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import { screen } from "@testing-library/react";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

describe("Accessibility sanity checks", () => {
  it("Landing page exposes a single level-one heading", async () => {
    supabaseStub.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithProviders(<Landing />);

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
  });

  it("Dashboard page keeps a single level-one heading with user data loaded", async () => {
    supabaseStub.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "dashboard-user" } } },
      error: null,
    });

    const profileQuery = createQueryStub({
      maybeSingleResult: {
        data: { id: "dashboard-user", name: "Dash User", headline: "Founder" },
        error: null,
      },
    });
    profileQuery.select.mockReturnValue(profileQuery);
    profileQuery.eq.mockReturnValue(profileQuery);

    const eventsQuery = createQueryStub({
      baseResult: {
        data: [
          {
            id: "event-1",
            name: "Launch Day",
            slug: "launch-day",
            starts_at: "2025-05-01T09:00:00.000Z",
          },
        ],
        error: null,
      },
    });
    eventsQuery.select.mockReturnValue(eventsQuery);
    eventsQuery.eq.mockReturnValue(eventsQuery);
    eventsQuery.order.mockReturnValue(eventsQuery);

    const attendancesQuery = createQueryStub({
      baseResult: {
        data: [
          {
            events: {
              id: "event-2",
              name: "Upcoming Meetup",
              slug: "upcoming-meetup",
              starts_at: "2025-05-10T10:00:00.000Z",
            },
          },
        ],
        error: null,
      },
    });
    attendancesQuery.select.mockReturnValue(attendancesQuery);
    attendancesQuery.eq.mockReturnValue(attendancesQuery);

    supabaseStub.from.mockImplementation((table) => {
      if (table === "profiles") {
        return profileQuery;
      }
      if (table === "events") {
        return eventsQuery;
      }
      if (table === "attendances") {
        return attendancesQuery;
      }
      return createQueryStub();
    });

    renderWithProviders(<Dashboard />);

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
  });
});
