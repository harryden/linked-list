import { renderWithProviders } from "@/test-utils/render";
import { supabase } from "@/integrations/supabase/client";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import EventSuccess from "@/pages/EventSuccess";
import { TEXT } from "@/constants/text";
import { eventCodeFromId } from "@/lib/events";

describe("EventSuccess smoke", () => {
  const eventId = "550e8400-e29b-41d4-a716-446655440000";
  const event = {
    id: eventId,
    slug: "launch-day",
    name: "Launch Day",
    organizer_id: "organizer-1",
    starts_at: null,
    ends_at: null,
    location: null,
  };

  const renderPage = () =>
    renderWithProviders(
      <Routes>
        <Route path="/event-success/:slug" element={<EventSuccess />} />
        <Route
          path="/dashboard"
          element={<div data-testid="dashboard-destination" />}
        />
      </Routes>,
      { route: "/event-success/launch-day" },
    );

  it("shows a loading indicator while the event is being fetched", () => {
    const single = vi.fn().mockReturnValue(new Promise(() => {}));
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single,
    } as const;

    supabase.from.mockImplementation(() => query);

    renderPage();

    expect(screen.getByText(TEXT.eventSuccess.loading)).toBeInTheDocument();
  });

  it("displays the event title and code once the event has loaded", async () => {
    const single = vi.fn().mockResolvedValue({ data: event, error: null });
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single,
    } as const;

    supabase.from.mockImplementation(() => query);

    renderPage();

    expect(
      await screen.findByText(TEXT.eventSuccess.title),
    ).toBeInTheDocument();

    const expectedCode = eventCodeFromId(eventId);
    expect(await screen.findByText(expectedCode)).toBeInTheDocument();
  });

  it("redirects to the dashboard when the event fails to load", async () => {
    const single = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "not found" } });
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single,
    } as const;

    supabase.from.mockImplementation(() => query);

    renderPage();

    expect(
      await screen.findByTestId("dashboard-destination"),
    ).toBeInTheDocument();
  });
});
