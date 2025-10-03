import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRScanner } from "@/components/QRScanner";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchEventWithClient,
  useMyEvents,
  useUpcoming,
  useJoinEvent,
  useMyProfile,
} from "@/hooks/useSupabaseData";
import DashboardHeader from "./dashboard/components/DashboardHeader";
import MyEventsList from "./dashboard/components/MyEventsList";
import UpcomingSection from "./dashboard/components/UpcomingSection";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const joinEvent = useJoinEvent();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!session) {
        setIsSessionLoading(false);
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);
      setIsSessionLoading(false);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const { data: profile, isLoading: isProfileLoading } = useMyProfile(
    userId ?? undefined,
  );

  const {
    data: myEventsData,
    isLoading: isMyEventsLoading,
  } = useMyEvents(userId ?? undefined, { enabled: Boolean(userId) });

  const {
    data: upcomingEventsData,
    isLoading: isUpcomingLoading,
  } = useUpcoming(userId ?? undefined, { enabled: Boolean(userId) });

  const myEvents = (myEventsData ?? []).map((event) => ({
    id: event.id,
    name: event.name,
    slug: event.slug,
    starts_at: event.starts_at ?? null,
  }));

  const upcomingEvents = (upcomingEventsData ?? []).map((event) => ({
    id: event.id,
    name: event.name,
    slug: event.slug,
    starts_at: event.starts_at ?? null,
  }));

  const isInitialLoading = isSessionLoading || isProfileLoading;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleQRScan = async (eventSlug: string) => {
    try {
      const eventData = await fetchEventWithClient(queryClient, {
        slug: eventSlug,
      });

      if (!eventData) {
        toast.error("Event not found");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to check in");
        navigate("/auth");
        return;
      }

      if (session.user.id === eventData.organizer_id) {
        toast.info(
          "Hey, this is your own event! Share the QR code at the event to let others check in.",
        );
        setShowScanner(false);
        navigate(`/event/${eventSlug}`);
        return;
      }

      await joinEvent.mutateAsync({
        eventId: eventData.id,
        userId: session.user.id,
        source: "qr",
      });

      toast.success("Checked in successfully!");
      setShowScanner(false);
      navigate(`/event/${eventSlug}`);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505"
      ) {
        toast.info("You're already checked in to this event!");
        setShowScanner(false);
        navigate(`/event/${eventSlug}`);
        return;
      }

      console.error("Error checking in:", error);
      toast.error("Failed to check in");
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardHeader
        name={profile?.name}
        headline={profile?.headline}
        avatarUrl={profile?.avatar_url}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <MyEventsList events={myEvents} isLoading={isMyEventsLoading} />
          <UpcomingSection
            events={upcomingEvents}
            isLoading={isUpcomingLoading}
            onScan={() => setShowScanner(true)}
          />
        </div>
      </main>

      <QRScanner
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default Dashboard;
