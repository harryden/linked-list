import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { useEvent } from "@/hooks/useEvents";
import { logger } from "@/lib/logger";
import { eventCodeFromId } from "@/lib/events";
import { getEventUrl } from "@/lib/urls";

const AVATAR_INITIALS = ["EV", "MC", "PS", "JO", "SV"];

const EventSuccess = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");

  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(slug ? { slug } : undefined);

  useEffect(() => {
    if (eventError) {
      logger.error(eventError, {
        category: "Events",
        extra: { message: "Error loading event" },
      });
      navigate("/dashboard");
    }
  }, [eventError, navigate]);

  useEffect(() => {
    if (!event) return;
    setEventName(event.name);
    setEventCode(eventCodeFromId(event.id));
  }, [event]);

  const handleDownload = () => {
    if (!event || !qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${event.slug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isEventLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-border-subtle border-t-text-primary animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="h-11" />

      <div className="flex-1 flex flex-col px-6 justify-between">
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Success circle */}
          <div className="w-14 h-14 rounded-full bg-state-success-bg border border-state-success flex items-center justify-center mb-6">
            <CheckCircle2
              className="h-7 w-7 text-state-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          {/* Eyebrow */}
          <div className="text-[11px] font-mono text-state-success tracking-[1px]">
            CHECKED IN · {eventCode}
          </div>

          {/* Heading */}
          <h1 className="text-[40px] font-semibold tracking-[-1px] mt-3 leading-[1]">
            You're in.
          </h1>

          {/* Subhead */}
          <p className="text-[15px] text-text-secondary leading-relaxed mt-4 max-w-sm">
            Your name is now on the roster — attendees are updating live.
            Connect with who's here.
          </p>

          {/* Tonight card */}
          <div className="mt-8 p-4 border border-border-subtle rounded-[10px] bg-bg-surface">
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px]">
              TONIGHT · {eventName.toUpperCase()}
            </div>
            <div className="flex items-center mt-2.5">
              {AVATAR_INITIALS.map((init, i) => (
                <div
                  key={init}
                  className="w-7 h-7 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[10px] font-medium text-text-secondary flex-shrink-0 relative"
                  style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}
                >
                  {init}
                </div>
              ))}
              <span className="text-[13px] font-medium ml-2.5">and others</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pb-6 flex flex-col gap-2">
          <Link to={`/event/${slug}`}>
            <Button variant="primary" size="xl" className="w-full gap-2">
              View attendees{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            Save QR code
          </Button>

          {/* Hidden QRCodePreview to generate the download URL */}
          <div className="hidden">
            <QRCodePreview
              value={`${getEventUrl(event.slug)}?ref=qr`}
              size={400}
              onDataUrlChange={setQrCodeUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSuccess;
