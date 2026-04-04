import { useEffect, useState, type ReactNode } from "react";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { TEXT } from "@/constants/text";

interface QRCodePreviewProps {
  value: string;
  size?: number;
  className?: string;
  imageClassName?: string;
  onDataUrlChange?: (dataUrl: string) => void;
  emptyState?: ReactNode;
}

const QRCodePreview = ({
  value,
  size = 256,
  className,
  imageClassName,
  onDataUrlChange,
  emptyState,
}: QRCodePreviewProps) => {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const generate = async () => {
      try {
        const { default: QRCode } = await import("qrcode");
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        if (isMounted) {
          setDataUrl(url);
          onDataUrlChange?.(url);
        }
      } catch (error) {
        logger.error(error, { category: "UI" });
        if (isMounted) {
          setDataUrl("");
          onDataUrlChange?.("");
        }
      }
    };

    setDataUrl("");
    onDataUrlChange?.("");

    if (value) {
      generate();
    }

    return () => {
      isMounted = false;
    };
  }, [value, size, onDataUrlChange]);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-white p-4 shadow-inner",
        className,
      )}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={TEXT.qrCodePreview.alt}
          className={cn("h-64 w-64", imageClassName)}
        />
      ) : (
        (emptyState ?? (
          <div
            className={cn(
              "flex h-64 w-64 items-center justify-center text-sm text-muted-foreground",
              imageClassName,
            )}
          >
            {TEXT.qrCodePreview.generating}
          </div>
        ))
      )}
    </div>
  );
};

export default QRCodePreview;
