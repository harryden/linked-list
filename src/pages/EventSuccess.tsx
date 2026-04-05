import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { useEvent } from "@/hooks/useEvents";
import { logger } from "@/lib/logger";
import { TEXT } from "@/constants/text";
import { eventCodeFromId } from "@/lib/events";
import PageContainer from "@/components/layout/PageContainer";
import Heading from "@/components/ui/heading";
import { getEventUrl } from "@/lib/urls";

const EventSuccess = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [timestamp, setTimestamp] = useState(() =>
    new Date().toLocaleTimeString(),
  );

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
    if (!event) {
      return;
    }

    setEventName(event.name);
    setEventCode(eventCodeFromId(event.id));
  }, [event]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = isEventLoading;

  const handleDownload = () => {
    if (!event || !qrCodeUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${event.slug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <PageContainer className="items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{TEXT.eventSuccess.loading}</p>
        </div>
      </PageContainer>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-1">
          <Heading level={1}>{eventName}</Heading>
          <p className="font-mono text-sm text-muted-foreground">{timestamp}</p>
        </div>

        <QRCodePreview
          value={`${getEventUrl(event.slug)}?ref=qr`}
          size={400}
          onDataUrlChange={setQrCodeUrl}
        />

        <div className="space-y-1">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {TEXT.eventSuccess.codeLabel}
          </p>
          <p className="font-mono text-4xl tracking-widest">{eventCode}</p>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            {TEXT.common.buttons.downloadQrCode}
          </Button>

          <Link to={`/event/${slug}`} className="block">
            <Button className="w-full">
              {TEXT.common.buttons.viewEventDashboard}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventSuccess;
