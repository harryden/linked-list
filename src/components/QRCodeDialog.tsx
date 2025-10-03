import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCodeSVG from "qrcode";

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
  eventName: string;
}

export const QRCodeDialog = ({
  open,
  onClose,
  eventSlug,
  eventName,
}: QRCodeDialogProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (open && eventSlug) {
      const eventUrl = `${window.location.origin}/event/${eventSlug}?ref=qr`;
      QRCodeSVG.toDataURL(eventUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).then(setQrCodeUrl);
    }
  }, [open, eventSlug]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${eventSlug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Event QR Code
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            Use this QR code to allow attendees to seamlessly register
            attendance
          </p>

          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <img
                  src={qrCodeUrl}
                  alt="Event QR Code"
                  className="w-64 h-64"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
