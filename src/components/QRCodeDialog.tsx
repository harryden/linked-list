import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Share2 } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { TEXT } from "@/constants/text";
import { getEventUrl } from "@/lib/urls";

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
    try {
      await navigator.share({
        title: eventName,
        url: `${getEventUrl(eventSlug)}?ref=share`,
      });
    } catch {
      // Share cancelled or unavailable — silently ignore
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AnimatePresence>
        {open && (
          <DialogPortal forceMount>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-[calc(100%-40px)] sm:max-w-sm -translate-x-1/2 -translate-y-1/2 bg-bg-base rounded-xl p-6 shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[11px] font-mono text-text-secondary tracking-[1px]">
                      {TEXT.qrCodeDialog.title}
                    </div>
                    <div className="text-lg font-semibold tracking-[-0.3px] mt-1">
                      {eventName}
                    </div>
                  </div>
                  <DialogPrimitive.Close
                    className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </DialogPrimitive.Close>
                </div>

                {/* QR frame — stark black-on-white, rounded-sm on frame only */}
                <div className="bg-white border border-border-subtle rounded-sm p-5 flex justify-center">
                  <QRCodePreview
                    value={`${getEventUrl(eventSlug)}?ref=qr`}
                    size={260}
                    onDataUrlChange={setQrCodeUrl}
                  />
                </div>

                {/* Code */}
                {eventCode && (
                  <div className="mt-4 text-center">
                    <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px]">
                      OR ENTER CODE
                    </div>
                    <div className="text-[24px] font-semibold font-mono tracking-[6px] tabular-nums mt-1.5">
                      {eventCode}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <Button
                    variant="outline"
                    size="md"
                    className="gap-2"
                    onClick={handleDownload}
                    disabled={!qrCodeUrl}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    {TEXT.common.buttons.downloadQrCode}
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Share
                  </Button>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
