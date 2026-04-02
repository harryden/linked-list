import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, QrCode, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { fetchEventsWithClient } from "@/hooks/useSupabaseData";
import { TEXT } from "@/constants/text";

const JoinEvent = () => {
  const [eventCode, setEventCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOwnEvent, setIsOwnEvent] = useState(false);
  const [ownEventSlug, setOwnEventSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Check if coming from dashboard, default to home
  const fromDashboard = location.state?.fromDashboard;
  const backPath = fromDashboard ? "/dashboard" : "/";
  const backText = fromDashboard
    ? TEXT.common.links.backToDashboard
    : TEXT.common.links.backToHome;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      toast.error(TEXT.joinEvent.toast.missingCode);
      return;
    }

    setIsLoading(true);
    setIsOwnEvent(false);
    setOwnEventSlug(null);

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Fetch only the event with the matching short code
      const events = await fetchEventsWithClient(queryClient, {
        shortCode: eventCode.trim(),
      });

      const matchingEvent = events?.[0];

      if (!matchingEvent) {
        toast.error(TEXT.joinEvent.toast.notFound);
        return;
      }

      // Check if user is the organizer
      if (userId && matchingEvent.organizer_id === userId) {
        setIsOwnEvent(true);
        setOwnEventSlug(matchingEvent.slug);
        toast.info("You're the organizer of this event");
        return;
      }

      // Navigate to event page
      navigate(`/event/${matchingEvent.slug}`);
    } catch (error) {
      console.error("Error finding event:", error);
      toast.error(TEXT.joinEvent.toast.failure);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <QrCode className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {TEXT.joinEvent.header.title}
          </CardTitle>
          <CardDescription className="text-base">
            {TEXT.joinEvent.header.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isOwnEvent && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {TEXT.joinEvent.alert.organizer}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="eventCode">{TEXT.joinEvent.form.label}</Label>
              <Input
                id="eventCode"
                type="text"
                placeholder={TEXT.joinEvent.form.placeholder}
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="text-center text-lg tracking-wider"
                maxLength={20}
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              {isOwnEvent && ownEventSlug ? (
                <Link to={`/event/${ownEventSlug}`}>
                  <Button
                    type="button"
                    className="w-full h-12 text-base font-medium rounded-full"
                  >
                    {TEXT.joinEvent.form.goToEvent}
                  </Button>
                </Link>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium rounded-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? TEXT.joinEvent.form.submitLoading
                    : TEXT.joinEvent.form.submitIdle}
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {TEXT.joinEvent.form.helperText}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinEvent;
