import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AttendeeList from "@/pages/event/components/AttendeeList";
import { TEXT } from "@/constants/text";

let attendeeCounter = 0;
const makeAttendee = (profileOverrides?: {
  id?: string;
  name?: string;
  headline?: string | null;
  avatar_url?: string | null;
  linkedin_id?: string | null;
}) => {
  attendeeCounter += 1;
  return {
    id: `attendance-${attendeeCounter}`,
    event_id: "event-1",
    user_id: profileOverrides?.id ?? "user-1",
    source: "manual",
    created_at: "2025-01-01T00:00:00Z",
    profiles: {
      id: "user-1",
      name: "Alice Smith",
      headline: "Software Engineer",
      avatar_url: null,
      linkedin_id: "alicesmith",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      role: "user",
      ...profileOverrides,
    },
  };
};

const attendees = [makeAttendee()];

const renderList = (props?: Partial<Parameters<typeof AttendeeList>[0]>) =>
  render(
    <AttendeeList
      attendees={[]}
      currentUserId={null}
      isOrganizer={false}
      isLoading={false}
      {...props}
    />,
  );

describe("AttendeeList", () => {
  describe("loading state", () => {
    it("shows the loading message while data is being fetched", () => {
      renderList({ isLoading: true });
      expect(
        screen.getByText(TEXT.event.attendeeList.loading),
      ).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows the organizer-specific empty message when there are no attendees", () => {
      renderList({ isOrganizer: true });
      expect(
        screen.getByText(TEXT.event.attendeeList.organizerEmpty),
      ).toBeInTheDocument();
    });

    it("shows the attendee-specific empty message for non-organizers", () => {
      renderList({ isOrganizer: false });
      expect(
        screen.getByText(TEXT.event.attendeeList.attendeeEmpty),
      ).toBeInTheDocument();
    });
  });

  describe("attendee count label", () => {
    it("uses the singular label for exactly one attendee", () => {
      renderList({ attendees: [makeAttendee()] });
      expect(
        screen.getByText(`1 ${TEXT.event.attendeeList.singular}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it("uses the plural label for two or more attendees", () => {
      renderList({
        attendees: [
          makeAttendee(),
          makeAttendee({ id: "user-2", name: "Bob Jones" }),
        ],
      });
      expect(
        screen.getByText(`2 ${TEXT.event.attendeeList.plural}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it("uses the plural label for zero attendees", () => {
      renderList({ attendees: [] });
      expect(
        screen.getByText(`0 ${TEXT.event.attendeeList.plural}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("attendee row", () => {
    it("renders the attendee's name", () => {
      renderList({ attendees });
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    it("renders the attendee's headline when present", () => {
      renderList({ attendees });
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    it("does not render a headline element when headline is absent", () => {
      renderList({ attendees: [makeAttendee({ headline: null })] });
      expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument();
    });

    it("shows 'View Your Profile' label for the current user", () => {
      renderList({ attendees, currentUserId: "user-1" });
      expect(
        screen.getByText(TEXT.event.header.viewSelfProfile),
      ).toBeInTheDocument();
    });

    it("shows 'View Profile' label for other attendees", () => {
      renderList({ attendees, currentUserId: "other-user" });
      expect(
        screen.getByText(TEXT.event.header.viewProfile),
      ).toBeInTheDocument();
    });

    it("renders avatar initials derived from the attendee name", () => {
      renderList({ attendees });
      expect(screen.getByText("AS")).toBeInTheDocument();
    });
  });

  describe("LinkedIn button", () => {
    it("opens the LinkedIn profile in a new tab when linkedin_id is set", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      const user = userEvent.setup();

      renderList({ attendees, currentUserId: "other-user" });

      await user.click(screen.getByText(TEXT.event.header.viewProfile));

      expect(openSpy).toHaveBeenCalledWith(
        "https://www.linkedin.com/in/alicesmith",
        "_blank",
        "noopener,noreferrer",
      );

      openSpy.mockRestore();
    });

    it("disables the button and does not open a tab when linkedin_id is missing", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

      renderList({
        attendees: [makeAttendee({ linkedin_id: null })],
        currentUserId: "other-user",
      });

      const button = screen.getByRole("button", {
        name: TEXT.event.header.viewProfile,
      });
      expect(button).toBeDisabled();
      expect(openSpy).not.toHaveBeenCalled();

      openSpy.mockRestore();
    });
  });
});
