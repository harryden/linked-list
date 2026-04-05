import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, QrCode, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { fetchEventsWithClient } from "@/hooks/useEvents";
import { TEXT } from "@/constants/text";
import PageContainer from "@/components/layout/PageContainer";
import Heading from "@/components/ui/heading";

const JoinEvent = () => {
  const { toast } = useToast();
  const [eventCode, setEventCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOwnEvent, setIsOwnEvent] = useState(false);
  const [ownEventSlug, setOwnEventSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const fromDashboard = location.state?.fromDashboard;
  const backPath = fromDashboard ? "/dashboard" : "/";
  const backText = fromDashboard
    ? TEXT.common.links.backToDashboard
    : TEXT.common.links.backToHome;

  const getAuthenticatedUserId = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user?.id;
  };

  const findEventByShortCode = async (shortCode: string) => {
    const events = await fetchEventsWithClient(queryClient, {
      shortCode: shortCode.trim(),
    });
    return events?.[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = eventCode.trim();

    if (!trimmedCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: TEXT.joinEvent.toast.missingCode,
      });
      return;
    }

    setIsLoading(true);
    setIsOwnEvent(false);
    setOwnEventSlug(null);

    try {
      const userId = await getAuthenticatedUserId();
      const matchingEvent = await findEventByShortCode(trimmedCode);

      if (!matchingEvent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: TEXT.joinEvent.toast.notFound,
        });
        return;
      }

      if (userId && matchingEvent.organizer_id === userId) {
        setIsOwnEvent(true);
        setOwnEventSlug(matchingEvent.slug);
        toast({
          description: TEXT.joinEvent.toast.organizerNotice,
        });
        return;
      }

      navigate(`/event/${matchingEvent.slug}`);
    } catch (error) {
      logger.error(error, {
        category: "Events",
        extra: { message: "Error finding event" },
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: TEXT.joinEvent.toast.failure,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="sm" className="justify-center">
      <div className="w-full mb-8">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backText}
        </Link>
      </div>

      <Card className="w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-glow-primary">
            <QrCode
              className="h-8 w-8 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <Heading level={1}>{TEXT.joinEvent.header.title}</Heading>
          <CardDescription className="text-base">
            {TEXT.joinEvent.header.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isOwnEvent && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
                aria-required="true"
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
    </PageContainer>
  );
};

export default JoinEvent;
