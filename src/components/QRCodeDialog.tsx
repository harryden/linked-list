import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { TEXT } from "@/constants/text";

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
  _eventName,
}: QRCodeDialogProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setQrCodeUrl("");
    }
  }, [open]);

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
            {TEXT.qrCodeDialog.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            {TEXT.qrCodeDialog.description}
          </p>

          {open && (
            <div className="flex justify-center">
              <QRCodePreview
                value={`${window.location.origin}/event/${eventSlug}?ref=qr`}
                size={400}
                onDataUrlChange={setQrCodeUrl}
              />
            </div>
          )}

          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4 mr-2" />
            {TEXT.common.buttons.downloadQrCode}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
