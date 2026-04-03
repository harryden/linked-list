import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Download } from "lucide-react";
import QRCodePreview from "@/components/QRCodePreview";
import { useEvent } from "@/hooks/useEvents";
import { TEXT } from "@/constants/text";
import { eventCodeFromId } from "@/lib/events";

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
      console.error("Error loading event:", eventError);
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
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{TEXT.eventSuccess.loading}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-success/10 p-4 rounded-full">
              <CalendarCheck className="h-12 w-12 text-success" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{TEXT.eventSuccess.title}</h1>
            <p className="text-muted-foreground">
              {TEXT.eventSuccess.description}
            </p>
          </div>

          {/* Event Code */}
          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {TEXT.eventSuccess.codeLabel}
            </p>
            <p className="text-4xl font-bold tracking-wider">{eventCode}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <QRCodePreview
              value={`${window.location.origin}/event/${event.slug}?ref=qr`}
              size={400}
              onDataUrlChange={setQrCodeUrl}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              disabled={!qrCodeUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              {TEXT.common.buttons.downloadQrCode}
            </Button>

            <Link to={`/event/${slug}`} className="block">
              <Button className="w-full rounded-full h-12 text-base font-medium">
                {TEXT.common.buttons.viewEventDashboard}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSuccess;
