import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AttendButton from "@/pages/event/components/AttendButton";
import { TEXT } from "@/constants/text";

const defaultProps = {
  isAttending: false,
  isLoading: false,
  isAuthenticated: false,
  onAttend: vi.fn(),
  onAuthRedirect: vi.fn(),
};

const renderButton = (props = {}) => {
  return render(
    <MemoryRouter>
      <AttendButton {...defaultProps} {...props} />
    </MemoryRouter>,
  );
};

describe("AttendButton contract", () => {
  it("exposes an actionable primary button with the current label", () => {
    renderButton({ isAuthenticated: true });

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkIn,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("renders the LinkedIn variant with the expected accessible label and icon", () => {
    renderButton({ isAuthenticated: false });

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });
    expect(button).toBeInTheDocument();
    expect(
      screen.getByText(TEXT.event.attendButton.checkInLinkedIn),
    ).toBeInTheDocument();
  });

  it("disables the control and shows the loading copy when the request is pending", () => {
    renderButton({ isLoading: true, isAuthenticated: true });

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkingIn,
    });
    expect(button).toBeDisabled();
  });

  it("hides the attend action for organizers and attendees", () => {
    const { rerender } = renderButton({ isAttending: true });

    expect(
      screen.queryByRole("button", {
        name: /check in/i,
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText(TEXT.event.header.checkedIn)).toBeInTheDocument();
  });

  it("routes unauthenticated users via the provided auth redirect handler", async () => {
    const onAuthRedirect = vi.fn();
    const user = userEvent.setup();
    renderButton({ isAuthenticated: false, onAuthRedirect });

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });

    await user.click(button);
    expect(onAuthRedirect).toHaveBeenCalled();
  });

  it("invokes the supplied check-in handler when the user is authenticated", async () => {
    const onAttend = vi.fn();
    const user = userEvent.setup();
    renderButton({ isAuthenticated: true, onAttend });

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkIn,
    });

    await user.click(button);
    expect(onAttend).toHaveBeenCalledTimes(1);
  });
});
