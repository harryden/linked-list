import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { useEvent } from "@/hooks/useEvents";
import { logger } from "@/lib/logger";
import { eventCodeFromId } from "@/lib/events";
import { getEventUrl } from "@/lib/urls";
import { TEXT } from "@/constants/text";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

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
      <LoadingScreen
        title={TEXT.eventSuccess.title}
        message={TEXT.eventSuccess.loading}
      />
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="h-11" />

      <div className="flex-1 flex flex-col px-6 justify-between max-w-lg mx-auto w-full">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-[56px] h-[56px] rounded-full bg-state-success-bg border border-state-success flex items-center justify-center mb-6">
            <CheckCircle2
              className="h-[28px] w-[28px] text-state-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          <div className="text-[11px] font-mono text-state-success tracking-[1px] uppercase">
            {TEXT.eventSuccess.title.toUpperCase()} · {eventCode}
          </div>

          <h1 className="text-[40px] font-semibold tracking-[-1px] mt-3 leading-[1]">
            Ready to go.
          </h1>

          <p className="text-[15px] text-text-secondary leading-relaxed mt-4 max-w-sm">
            {TEXT.eventSuccess.description}
          </p>

          <div className="mt-8 p-4 border border-border-subtle rounded-xl bg-bg-surface">
            <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px] uppercase">
              EVENT · {eventName.toUpperCase()}
            </div>
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="bg-white border border-border-subtle rounded-sm p-3">
                <QRCodePreview
                  value={`${getEventUrl(event.slug)}?ref=qr`}
                  size={200}
                  onDataUrlChange={setQrCodeUrl}
                  className="shadow-none p-0"
                  imageClassName="h-[200px] w-[200px]"
                />
              </div>
              <div className="text-center">
                <div className="text-[11px] font-mono text-text-secondary uppercase">
                  Check-in code
                </div>
                <div className="text-[24px] font-semibold font-mono tracking-[4px] mt-1 uppercase">
                  {eventCode.replace(/(\w{2})(\w{4})/, "$1 · $2")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-6 flex flex-col gap-2 mt-8">
          <Link to={`/event/${slug}`}>
            <Button variant="primary" size="xl" className="w-full gap-2">
              View event page{" "}
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
            {TEXT.common.buttons.downloadQrCode}
          </Button>
          <Link to="/dashboard">
            <Button variant="ghost" size="lg" className="w-full">
              {TEXT.common.links.backToDashboard}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventSuccess;
