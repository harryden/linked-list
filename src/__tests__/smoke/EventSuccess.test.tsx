import { renderWithProviders } from "@/test-utils/render";
import { Route, Routes } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import EventSuccess from "@/pages/EventSuccess";
import { TEXT } from "@/constants/text";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";
import { vi, describe, it, expect } from "vitest";

const renderPage = (slug = "weekend-mvp-launch-abc123") => {
  const query = createQueryStub({
    singleResult: {
      data: {
        id: "event-1",
        slug,
        short_code: "123456",
        name: "Weekend MVP Launch",
      },
      error: null,
    },
  });
  supabaseStub.from.mockImplementation(() => query);

  return renderWithProviders(
    <Routes>
      <Route path="/event-success/:slug" element={<EventSuccess />} />
      <Route path="/dashboard" element={<div>Dashboard View</div>} />
    </Routes>,
    { route: `/event-success/${slug}` },
  );
};

describe("EventSuccess smoke", () => {
  it("shows a loading indicator while the event is being fetched", async () => {
    renderPage();
    expect(
      screen.getByText(TEXT.eventSuccess.loading.toString()),
    ).toBeInTheDocument();
  });

  it("displays the event title and code once the event has loaded", async () => {
    renderPage();
    expect(await screen.findByText("123456")).toBeInTheDocument();
    expect(
      screen.getByText(TEXT.eventSuccess.description.toString()),
    ).toBeInTheDocument();
  });

  it("redirects to the dashboard when the event fails to load", async () => {
    // Override mock to simulate failure
    supabaseStub.from.mockImplementation(() =>
      createQueryStub({
        singleResult: { data: null, error: { message: "Not found" } },
      }),
    );

    renderPage();

    await waitFor(
      () => {
        expect(screen.getByText(/dashboard view/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
