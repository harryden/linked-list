import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { TEXT } from "@/constants/text";
import { getEventUrl } from "@/lib/urls";

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
      <AnimatePresence>
        {open && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 8 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 28,
                  mass: 0.8,
                }}
                className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-border-subtle bg-bg-base p-6 rounded-xl shadow-md"
              >
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl">
                    {TEXT.qrCodeDialog.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <p className="text-center text-muted-foreground">
                    {TEXT.qrCodeDialog.description}
                  </p>

                  <div className="flex justify-center">
                    <QRCodePreview
                      value={`${getEventUrl(eventSlug)}?ref=qr`}
                      size={400}
                      onDataUrlChange={setQrCodeUrl}
                    />
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
                <DialogPrimitive.Close
                  className="absolute right-4 top-4 rounded p-1 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
