import { renderWithProviders } from "@/test-utils/render";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import JoinEvent from "@/pages/JoinEvent";
import { TEXT } from "@/constants/text";

describe("JoinEvent navigation", () => {
  it("explains where to find the event code", () => {
    renderWithProviders(
      <Routes>
        <Route path="/join-event" element={<JoinEvent />} />
      </Routes>,
      { route: "/join-event" },
    );

    expect(
      screen.getByText(TEXT.joinEvent.header.description),
    ).toBeInTheDocument();
    expect(screen.getByText(TEXT.joinEvent.form.hint)).toBeInTheDocument();
    expect(
      screen.getByText(TEXT.joinEvent.form.helperText),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(TEXT.joinEvent.form.label)).toHaveAttribute(
      "aria-describedby",
      "eventCode-hint eventCode-format",
    );
  });

  it("defaults to 'Back to Home' when no state is provided", () => {
    renderWithProviders(
      <Routes>
        <Route path="/join-event" element={<JoinEvent />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>,
      { route: "/join-event" },
    );

    const backLink = screen.getByRole("link", {
      name: new RegExp(TEXT.common.links.backToHome, "i"),
    });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("shows 'Back to Dashboard' when coming from dashboard", () => {
    renderWithProviders(
      <Routes>
        <Route path="/join-event" element={<JoinEvent />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      {
        initialEntries: [
          { pathname: "/join-event", state: { fromDashboard: true } },
        ],
      },
    );

    const backLink = screen.getByRole("link", {
      name: new RegExp(TEXT.common.links.backToDashboard, "i"),
    });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });

  it("shows 'Back to Sign In' when coming from auth", () => {
    renderWithProviders(
      <Routes>
        <Route path="/join-event" element={<JoinEvent />} />
        <Route path="/auth" element={<div>Auth</div>} />
      </Routes>,
      {
        initialEntries: [
          { pathname: "/join-event", state: { fromAuth: true } },
        ],
      },
    );

    const backLink = screen.getByRole("link", {
      name: new RegExp(TEXT.common.links.backToSignIn, "i"),
    });
    expect(backLink).toHaveAttribute("href", "/auth?next=/join-event");
  });
});
