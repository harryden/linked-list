import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import EventHeader from "@/pages/event/components/EventHeader";
import { TEXT } from "@/constants/text";

const baseEvent = {
  id: "event-1",
  slug: "launch-day",
  name: "Launch Day",
  organizer_id: "organizer-1",
  starts_at: "2025-06-15T09:00:00.000Z",
  ends_at: "2025-06-15T11:00:00.000Z",
  location: "Gothenburg, Sweden",
};

const organizer = {
  id: "organizer-1",
  name: "Jane Doe",
  headline: "Event Organizer",
  avatar_url: null,
  linkedin_id: "janedoe",
};

const defaultProps = {
  event: baseEvent,
  eventCode: "123456",
  organizer,
  currentUserId: null,
  isOrganizer: false,
  isAttending: false,
};

describe("EventHeader", () => {
  describe("event details", () => {
    it("renders the event name", () => {
      render(<EventHeader {...defaultProps} />);
      expect(screen.getByText("Launch Day")).toBeInTheDocument();
    });

    it("renders the event code with the label", () => {
      render(<EventHeader {...defaultProps} />);
      expect(
        screen.getByText(`${TEXT.common.labels.eventCode}: 123456`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it("renders the event location", () => {
      render(<EventHeader {...defaultProps} />);
      expect(screen.getByText("Gothenburg, Sweden")).toBeInTheDocument();
    });

    it("does not render a date section when starts_at and ends_at are both absent", () => {
      render(
        <EventHeader
          {...defaultProps}
          event={{ ...baseEvent, starts_at: null, ends_at: null }}
        />,
      );
      expect(
        screen.queryByText(TEXT.common.labels.dateNotSet),
      ).not.toBeInTheDocument();
    });

    it("does not render a time section when starts_at and ends_at are both absent", () => {
      render(
        <EventHeader
          {...defaultProps}
          event={{ ...baseEvent, starts_at: null, ends_at: null }}
        />,
      );
      expect(
        screen.queryByText(TEXT.common.labels.timeNotSet),
      ).not.toBeInTheDocument();
    });

    it("does not render the location element when location is absent", () => {
      render(
        <EventHeader
          {...defaultProps}
          event={{ ...baseEvent, location: null }}
        />,
      );
      expect(screen.queryByText("Gothenburg, Sweden")).not.toBeInTheDocument();
    });
  });

  describe("organizer section", () => {
    it("renders the organizer name with the hosted-by prefix", () => {
      render(<EventHeader {...defaultProps} />);
      expect(screen.getByText(TEXT.event.header.hostedBy)).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("renders the organizer headline when present", () => {
      render(<EventHeader {...defaultProps} />);
      expect(screen.getByText("Event Organizer")).toBeInTheDocument();
    });

    it("shows 'View Your Profile' when the current user is the organizer", () => {
      render(<EventHeader {...defaultProps} currentUserId="organizer-1" />);
      expect(
        screen.getByText(TEXT.event.header.viewSelfProfile),
      ).toBeInTheDocument();
    });

    it("shows 'View Profile' for other users", () => {
      render(<EventHeader {...defaultProps} currentUserId="other-user" />);
      expect(
        screen.getByText(TEXT.event.header.viewProfile),
      ).toBeInTheDocument();
    });

    it("opens the organizer's LinkedIn profile in a new tab", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      const user = userEvent.setup();

      render(<EventHeader {...defaultProps} currentUserId="other-user" />);

      await user.click(screen.getByText(TEXT.event.header.viewProfile));

      expect(openSpy).toHaveBeenCalledWith(
        "https://www.linkedin.com/in/janedoe",
        "_blank",
        "noopener,noreferrer",
      );

      openSpy.mockRestore();
    });

    it("shows an info toast when the organizer has no linkedin_id", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      const user = userEvent.setup();

      render(
        <EventHeader
          {...defaultProps}
          organizer={{ ...organizer, linkedin_id: null }}
        />,
      );

      await user.click(screen.getByText(TEXT.event.header.viewProfile));

      expect(openSpy).not.toHaveBeenCalled();

      openSpy.mockRestore();
    });
  });

  describe("check-in badge", () => {
    it("shows the checked-in badge when the user is attending", () => {
      render(<EventHeader {...defaultProps} isAttending />);
      expect(
        screen.getByText(TEXT.event.header.checkedInShort),
      ).toBeInTheDocument();
    });

    it("hides the checked-in badge when the user is not attending", () => {
      render(<EventHeader {...defaultProps} isAttending={false} />);
      expect(
        screen.queryByText(TEXT.event.header.checkedInShort),
      ).not.toBeInTheDocument();
    });
  });

  describe("organizer controls", () => {
    it("shows the View QR Code button for organizers when onShowQr is provided", () => {
      render(<EventHeader {...defaultProps} isOrganizer onShowQr={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: TEXT.common.buttons.viewQrCode }),
      ).toBeInTheDocument();
    });

    it("hides the View QR Code button for non-organizers", () => {
      render(
        <EventHeader
          {...defaultProps}
          isOrganizer={false}
          onShowQr={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: TEXT.common.buttons.viewQrCode }),
      ).not.toBeInTheDocument();
    });

    it("shows the options dropdown trigger for organizers when edit/delete handlers are provided", () => {
      render(
        <EventHeader
          {...defaultProps}
          isOrganizer
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(
        screen.getByRole("button", { name: TEXT.event.header.options }),
      ).toBeInTheDocument();
    });

    it("opens the dropdown and exposes edit and delete items", async () => {
      const user = userEvent.setup();
      render(
        <EventHeader
          {...defaultProps}
          isOrganizer
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: TEXT.event.header.options }),
      );

      expect(
        await screen.findByText(TEXT.event.header.edit),
      ).toBeInTheDocument();
      expect(screen.getByText(TEXT.event.header.delete)).toBeInTheDocument();
    });

    it("calls onEdit when the Edit item is selected", async () => {
      const onEdit = vi.fn();
      const user = userEvent.setup();

      render(
        <EventHeader
          {...defaultProps}
          isOrganizer
          onEdit={onEdit}
          onDelete={vi.fn()}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: TEXT.event.header.options }),
      );
      await user.click(await screen.findByText(TEXT.event.header.edit));

      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("calls onDelete when the Delete item is selected", async () => {
      const onDelete = vi.fn();
      const user = userEvent.setup();

      render(
        <EventHeader
          {...defaultProps}
          isOrganizer
          onEdit={vi.fn()}
          onDelete={onDelete}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: TEXT.event.header.options }),
      );
      await user.click(await screen.findByText(TEXT.event.header.delete));

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("does not show the options menu trigger when isOrganizer is false", () => {
      render(
        <EventHeader
          {...defaultProps}
          isOrganizer={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: TEXT.event.header.options }),
      ).not.toBeInTheDocument();
    });
  });

  describe("compact variant", () => {
    it("renders the event name in the compact variant", () => {
      render(<EventHeader {...defaultProps} variant="compact" />);
      expect(
        screen.getByRole("heading", { name: "Launch Day" }),
      ).toBeInTheDocument();
    });

    it("renders the event code in the compact variant", () => {
      render(<EventHeader {...defaultProps} variant="compact" />);
      expect(
        screen.getByText(`${TEXT.common.labels.eventCode}: 123456`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it("renders the organizer name with 'Hosted by' in the compact variant", () => {
      render(<EventHeader {...defaultProps} variant="compact" />);
      expect(
        screen.getByText(`${TEXT.event.header.hostedBy} Jane Doe`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });
  });
});
