import { renderWithProviders } from "@/test-utils/render";
import { supabase } from "@/integrations/supabase/client";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import EventPage from "@/pages/EventPage";
import { TEXT } from "@/constants/text";

describe("EventPage states", () => {
  it("renders the not-found view when the event does not exist", async () => {
    const single = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "not found" } });
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single,
    } as any;

    vi.mocked(supabase.from).mockImplementationOnce(() => query);

    renderWithProviders(
      <Routes>
        <Route path="/event/:slug" element={<EventPage />} />
        <Route path="/" element={<div />} />
      </Routes>,
      { route: "/event/missing-event" },
    );

    expect(
      await screen.findByText(TEXT.event.page.notFoundTitle),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(TEXT.event.page.notFoundDescription),
    ).toBeInTheDocument();
  });
});
