import { renderWithProviders } from "@/test-utils/render";
import { supabase } from "@/integrations/supabase/client";
import { createQueryStub } from "@/test-utils/supabase";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import EventPage from "@/pages/EventPage";
import { TEXT } from "@/constants/text";

describe("EventPage states", () => {
  it("renders the not-found view when the event does not exist", async () => {
    const query = createQueryStub({
      singleResult: { data: null, error: { message: "not found" } },
    });

    vi.mocked(supabase.from).mockImplementationOnce(() => query);

    renderWithProviders(
      <Routes>
        <Route path="/event/:slug" element={<EventPage />} />
        <Route path="/" element={<div />} />
      </Routes>,
      { route: "/event/missing-event" },
    );

    expect(
      await screen.findByRole("heading", { name: TEXT.event.page.notFoundTitle }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText((content) =>
        content.includes(TEXT.event.page.notFoundDescription),
      ),
    ).toBeInTheDocument();
  });

  it("does not show the 'Export CSV' option when there are zero attendees", async () => {
    const user = userEvent.setup();

    // Mock session for organizer
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } as any },
      error: null,
    });

    // Mock event data
    const eventQuery = createQueryStub({
      singleResult: {
        data: {
          id: "event-1",
          slug: "test-event",
          name: "Test Event",
          organizer_id: "user-1",
          starts_at: new Date().toISOString(),
          ends_at: new Date().toISOString(),
          location: "Test Location",
        },
        error: null,
      },
    });

    // Mock attendance data (zero attendees)
    const attendanceQuery = createQueryStub({
      multipleResult: { data: [], error: null },
    });

    // Mock profiles data
    const profileQuery = createQueryStub({
      singleResult: { data: { name: "Test Organizer" }, error: null },
    });

    vi.mocked(supabase.from).mockImplementation((table: any) => {
      if (table === "events") return eventQuery;
      if (table === "attendances") return attendanceQuery;
      if (table === "profiles") return profileQuery;
      return createQueryStub({});
    });

    renderWithProviders(
      <Routes>
        <Route path="/event/:slug" element={<EventPage />} />
      </Routes>,
      { route: "/event/test-event" },
    );

    // Wait for event to load
    await screen.findByText("Test Event");

    // Open the dropdown menu
    const optionsButton = await screen.findByRole("button", {
      name: TEXT.event.header.options,
    });
    await user.click(optionsButton);

    // Verify 'Export CSV' is NOT in the document
    expect(
      screen.queryByText(TEXT.event.attendeeList.exportCsv),
    ).not.toBeInTheDocument();
  });
});
