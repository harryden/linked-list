import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { getEventUrl } from "@/lib/urls";
import { TEXT } from "@/constants/text";

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
  eventName: string;
  eventCode?: string;
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

  const handleShare = async () => {
    const url = `${getEventUrl(eventSlug)}?ref=share`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          url,
        });
      } catch {
        // Share cancelled or unavailable
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard write failed
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-full max-w-[calc(100%-40px)] sm:max-w-sm p-6 gap-0">
        {/* Header */}
        <div className="mb-5">
          <DialogTitle className="text-[11px] font-mono text-text-secondary tracking-[1px] uppercase">
            {TEXT.qrCodeDialog.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {TEXT.qrCodeDialog.description}
          </DialogDescription>
          <div className="text-[18px] font-semibold tracking-[-0.3px] mt-1">
            {eventName}
          </div>
        </div>

        {/* QR frame */}
        <div className="bg-white border border-border-subtle rounded-sm p-[20px] flex justify-center">
          <QRCodePreview
            value={`${getEventUrl(eventSlug)}?ref=qr`}
            size={260}
            onDataUrlChange={setQrCodeUrl}
            className="shadow-none p-0"
            imageClassName="h-[260px] w-[260px]"
          />
        </div>

        {/* Code */}
        {eventCode && (
          <div className="mt-4 text-center">
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px] uppercase">
              OR ENTER CODE
            </div>
            <div className="text-[24px] font-semibold font-mono tracking-[6px] tabular-nums mt-1.5 uppercase">
              {eventCode.replace(/(\w{2})(\w{4})/, "$1 · $2")}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <Button
            variant="outline"
            size="md"
            className="gap-2 h-10 px-4"
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {TEXT.common.buttons.downloadQrCode}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="gap-2 h-10 px-4"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
