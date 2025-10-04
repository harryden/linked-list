import { useEffect, useRef, useState } from "react";
import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import { TEXT } from "@/constants/text";

vi.mock("@/components/QRCodePreview", () => ({
  default: ({
    onDataUrlChange,
  }: {
    onDataUrlChange?: (url: string) => void;
  }) => {
    useEffect(() => {
      onDataUrlChange?.("data:image/png;base64,qr");
    }, [onDataUrlChange]);

    return (
      <img
        src="data:image/png;base64,qr"
        alt={TEXT.qrCodePreview.alt}
        data-testid="mock-qr"
      />
    );
  },
}));

const DialogHarness = () => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" ref={triggerRef} onClick={() => setOpen(true)}>
        Show QR
      </button>
      <QRCodeDialog
        open={open}
        onClose={() => {
          setOpen(false);
          queueMicrotask(() => triggerRef.current?.focus());
        }}
        eventSlug="launch-day"
        eventName="Launch Day"
      />
    </div>
  );
};

describe("QRCodeDialog", () => {
  it("opens as an accessible dialog with the QR preview rendered", async () => {
    const { getByRole, getByAltText } = render(<DialogHarness />);
    const user = userEvent.setup();

    const trigger = getByRole("button", { name: /show qr/i });
    await user.click(trigger);

    const dialog = getByRole("dialog", { name: TEXT.qrCodeDialog.title });
    expect(dialog).toBeInTheDocument();
    expect(getByAltText(TEXT.qrCodePreview.alt)).toBeInTheDocument();
    expect(
      getByRole("button", {
        name: TEXT.common.buttons.downloadQrCode,
      }),
    ).toBeEnabled();
  });

  it("closes on escape and restores focus to the trigger for accessibility", async () => {
    const { getByRole, queryByRole } = render(<DialogHarness />);
    const user = userEvent.setup();

    const trigger = getByRole("button", { name: /show qr/i });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
