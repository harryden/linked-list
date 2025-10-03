import { useEffect, useRef, useState, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";

type Html5QrcodeType = import("html5-qrcode").Html5Qrcode;

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (eventSlug: string) => void;
}

export const QRScanner = ({ open, onClose, onScan }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeType | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const readerId = useId();

  const waitForElement = async (id: string, attempts = 10, delay = 50) => {
    for (let i = 0; i < attempts; i++) {
      if (document.getElementById(id)) return true;
      await new Promise((res) => setTimeout(res, delay));
    }
    return false;
  };

  useEffect(() => {
    if (open) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [open]);

  const startScanner = async () => {
    setHasPermission(null);
    const exists = await waitForElement(readerId);
    if (!exists) {
      console.error("QR element not available");
      return;
    }
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {},
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err: any) {
      console.error("Failed to start scanner:", err);
      const msg = String(err?.message || err);
      const name = err?.name;
      if (
        name === "NotAllowedError" ||
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("notallowederror")
      ) {
        setHasPermission(false);
      } else {
        setHasPermission(null);
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScan = async (decodedText: string) => {
    try {
      // Extract event slug from URL
      // Expected format: https://domain.com/event/slug or https://domain.com/event/slug?ref=qr
      const url = new URL(decodedText);
      const pathParts = url.pathname.split("/");
      const eventIndex = pathParts.indexOf("event");

      if (eventIndex !== -1 && pathParts[eventIndex + 1]) {
        const slug = pathParts[eventIndex + 1];
        await stopScanner();
        onScan(slug);
        onClose();
      } else {
        toast.error(TEXT.qrScannerErrors.invalidQr);
      }
    } catch (err) {
      console.error("Error parsing QR code:", err);
      toast.error(TEXT.qrScannerErrors.invalidFormat);
    }
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
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {TEXT.qrScanner.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {hasPermission === false
              ? TEXT.qrScanner.permissionDenied
              : TEXT.qrScanner.instructions}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {hasPermission === false ? (
            <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {TEXT.qrScanner.permissionDenied}
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                id={readerId}
                className="w-full h-64 rounded-lg overflow-hidden bg-black"
              />
            </div>
          )}
          {hasPermission !== false && (
            <p className="text-sm text-muted-foreground text-center">
              {TEXT.qrScanner.instructions}
            </p>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            {TEXT.common.buttons.cancel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
