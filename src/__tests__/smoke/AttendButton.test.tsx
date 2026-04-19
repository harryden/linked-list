import { renderWithProviders } from "@/test-utils/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AttendButton from "@/pages/event/components/AttendButton";
import { TEXT } from "@/constants/text";

describe("AttendButton smoke", () => {
  it("invokes the provided callback when a signed-in attendee checks in", async () => {
    const onAttend = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <AttendButton
        isAuthenticated={true}
        isLoading={false}
        isAttending={false}
        onAttend={onAttend}
        onAuthRedirect={() => {}}
      />,
    );

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkIn,
    });
    await user.click(button);

    expect(onAttend).toHaveBeenCalled();
  });

  it("hides the button when the attendee is already checked in", () => {
    renderWithProviders(
      <AttendButton
        isAuthenticated={true}
        isLoading={false}
        isAttending={true}
        onAttend={() => {}}
        onAuthRedirect={() => {}}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /check in/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(TEXT.event.header.checkedIn)).toBeInTheDocument();
  });

  it("invokes the auth redirect handler when not signed in", async () => {
    const onAuthRedirect = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <AttendButton
        isAuthenticated={false}
        isLoading={false}
        isAttending={false}
        onAttend={() => {}}
        onAuthRedirect={onAuthRedirect}
      />,
    );

    const button = screen.getByRole("button", {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });

    await user.click(button);
    expect(onAuthRedirect).toHaveBeenCalled();
  });
});
