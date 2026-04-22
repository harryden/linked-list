import { renderWithProviders } from "@/test-utils/render";
import { supabase } from "@/integrations/supabase/client";
import { createQueryStub } from "@/test-utils/supabase";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import Dashboard from "@/pages/Dashboard";

describe("Dashboard", () => {
  it("displays correct counts for hosted events", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } as any },
      error: null,
    });

    const now = Date.now();
    const futureDate = new Date(now + 86400000).toISOString(); // +1 day
    const pastDate = new Date(now - 86400000).toISOString(); // -1 day

    vi.mocked(supabase.from).mockImplementation((table: any) => {
      if (table === "events") {
        return createQueryStub({
          baseResult: {
            data: [
              {
                id: "event-1",
                name: "Future Event",
                starts_at: futureDate,
                organizer_id: "user-1",
              },
              {
                id: "event-2",
                name: "Past Event",
                starts_at: pastDate,
                organizer_id: "user-1",
              }
            ],
            error: null,
          }
        });
      }
      return createQueryStub({});
    });

    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>,
      { route: "/dashboard" }
    );

    // Wait for it to load
    expect(await screen.findByText("2 events hosted · 0 attended")).toBeInTheDocument();

    // Check tabs
    expect(screen.getByText("Future Event")).toBeInTheDocument();
    expect(screen.queryByText("Past Event")).not.toBeInTheDocument();
  });
});
