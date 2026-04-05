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
import { getEventUrl } from "@/lib/urls";

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
  eventName: string;
  eventCode: string;
}

export const QRCodeDialog = ({
  open,
  onClose,
  eventSlug,
  eventName,
  eventCode,
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display font-black text-2xl tracking-tight leading-none">
            {eventName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {open && (
            <div className="flex justify-center">
              <QRCodePreview
                value={`${getEventUrl(eventSlug)}?ref=qr`}
                size={400}
                onDataUrlChange={setQrCodeUrl}
              />
            </div>
          )}

          <div className="text-center space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {TEXT.qrCodeDialog.title}
            </p>
            <p className="font-mono text-3xl tracking-widest">{eventCode}</p>
          </div>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            {TEXT.common.buttons.downloadQrCode}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
