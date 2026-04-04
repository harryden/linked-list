import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Download } from "lucide-react";
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
    <PageContainer maxWidth="sm" className="justify-center">
      <Card className="w-full shadow-2xl">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          <div className="flex justify-center">
            <div className="bg-success/10 p-4 rounded-full shadow-glow-primary/10">
              <CalendarCheck className="h-12 w-12 text-success" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <Heading level={2}>{TEXT.eventSuccess.title}</Heading>
            <p className="text-muted-foreground">
              {TEXT.eventSuccess.description}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {TEXT.eventSuccess.codeLabel}
            </p>
            <p className="text-4xl font-bold tracking-wider">{eventCode}</p>
          </div>

          <div className="flex justify-center">
            <QRCodePreview
              value={`${getEventUrl(event.slug)}?ref=qr`}
              size={400}
              onDataUrlChange={setQrCodeUrl}
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full h-12 rounded-full"
              disabled={!qrCodeUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              {TEXT.common.buttons.downloadQrCode}
            </Button>

            <Link to={`/event/${slug}`} className="block">
              <Button className="w-full rounded-full h-12 text-base font-medium shadow-glow-primary">
                {TEXT.common.buttons.viewEventDashboard}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default EventSuccess;
