import { renderWithProviders } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import EventPage from "@/pages/EventPage";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";
import { TEXT } from "@/constants/text";

const mockEvent = {
  id: "event-1",
  name: "Launch Day",
  slug: "launch-day-123",
  location: "Gothenburg, Sweden",
  organizer_id: "user-2",
  starts_at: "2025-06-15T11:00:00Z",
  ends_at: "2025-06-15T13:00:00Z",
  short_code: "123456",
};

const mockOrganizer = {
  id: "user-2",
  name: "Jane Doe",
  avatar_url: "https://example.com/jane.jpg",
  headline: "Event Coordinator",
  linkedin_id: "janedoe",
};

describe("EventPage check-in arrival moment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    supabaseStub.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
      error: null,
    });

    // Default setup for success cases
    supabaseStub.from.mockImplementation((table) => {
      if (table === "events")
        return createQueryStub({ singleResult: { data: mockEvent } });
      if (table === "profiles")
        return createQueryStub({ singleResult: { data: mockOrganizer } });
      if (table === "attendances") return createQueryStub({ data: [] });
      return createQueryStub();
    });
  });

  it("does not show the welcome banner on a plain page load", async () => {
    renderWithProviders(<EventPage />, {
      route: "/event/launch-day-123",
      path: "/event/:slug",
    });

    await waitFor(() => {
      // Use queryByText with a regex to be more flexible with the translation proxy
      expect(
        screen.queryByText(/in! here's who else/i),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the welcome banner after a successful check-in", async () => {
    const user = userEvent.setup();

    renderWithProviders(<EventPage />, {
      route: "/event/launch-day-123",
      path: "/event/:slug",
    });

    // Wait for event to load so the AttendButton is visible
    const checkInBtn = await screen.findByRole("button", {
      name: /check in/i,
    });

    // Mock successful check-in response for the mutation
    const insertQuery = createQueryStub({ error: null });
    supabaseStub.from.mockImplementation((table) => {
      if (table === "attendances") return insertQuery;
      if (table === "events")
        return createQueryStub({ singleResult: { data: mockEvent } });
      if (table === "profiles")
        return createQueryStub({ singleResult: { data: mockOrganizer } });
      return createQueryStub();
    });

    await user.click(checkInBtn);

    expect(await screen.findByText(/in! here's who else/i)).toBeInTheDocument();
  });

  it("dismisses the banner when the X button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<EventPage />, {
      route: "/event/launch-day-123",
      path: "/event/:slug",
    });

    const checkInBtn = await screen.findByRole("button", {
      name: /check in/i,
    });

    // Mock successful check-in state
    const insertQuery = createQueryStub({ error: null });
    supabaseStub.from.mockImplementation((table) => {
      if (table === "attendances") return insertQuery;
      if (table === "events")
        return createQueryStub({ singleResult: { data: mockEvent } });
      if (table === "profiles")
        return createQueryStub({ singleResult: { data: mockOrganizer } });
      return createQueryStub();
    });

    await user.click(checkInBtn);

    const banner = await screen.findByText(/in! here's who else/i);
    expect(banner).toBeInTheDocument();

    // Use queryByRole for the close button
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    expect(screen.queryByText(/in! here's who else/i)).not.toBeInTheDocument();
  });

  it("scrolls to the attendee list after attendee data loads", async () => {
    const scrollSpy = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollSpy;

    renderWithProviders(<EventPage />, {
      route: "/event/launch-day-123",
      path: "/event/:slug",
    });

    const checkInBtn = await screen.findByRole("button", {
      name: /check in/i,
    });

    // Mock successful check-in state
    const insertQuery = createQueryStub({ error: null });
    supabaseStub.from.mockImplementation((table) => {
      if (table === "attendances") return insertQuery;
      if (table === "events")
        return createQueryStub({ singleResult: { data: mockEvent } });
      if (table === "profiles")
        return createQueryStub({ singleResult: { data: mockOrganizer } });
      return createQueryStub();
    });

    await user.click(checkInBtn);

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalled();
    });
  });
});
