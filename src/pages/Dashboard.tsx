import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";
import { useMyEvents } from "@/hooks/useEvents";
import { useUpcoming } from "@/hooks/useAttendances";
import { useMyProfile } from "@/hooks/useProfile";
import DashboardHeader from "./dashboard/components/DashboardHeader";
import MyEventsList from "./dashboard/components/MyEventsList";
import UpcomingSection from "./dashboard/components/UpcomingSection";
import PageContainer from "@/components/layout/PageContainer";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const navigate = useNavigate();

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

  const { data: myEventsData, isLoading: isMyEventsLoading } = useMyEvents(
    userId ?? undefined,
    { enabled: Boolean(userId) },
  );

  const { data: upcomingEventsData, isLoading: isUpcomingLoading } =
    useUpcoming(userId ?? undefined, { enabled: Boolean(userId) });

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

  const greeting = useMemo(() => {
    if (
      !profile?.name &&
      myEvents.length === 0 &&
      upcomingEvents.length === 0
    ) {
      return "Hey, glad to have you here! Ready to start connecting?";
    }

    if (myEvents.length === 0 && upcomingEvents.length === 0) {
      return "Hey, glad to have you here! Ready to start connecting?";
    }

    if (myEvents.length === 0 && upcomingEvents.length === 1) {
      return "Nice, you got your first check in!";
    }

    if (myEvents.length === 1 && upcomingEvents.length === 0) {
      return "Nice job hosting your first event, share the 6 digit code or QR code and start connecting!";
    }

    return `Welcome back, ${profile?.name ?? "friend"}!`;
  }, [myEvents.length, upcomingEvents.length, profile?.name]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success(TEXT.dashboard.header.signOutSuccess);
    navigate("/");
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{TEXT.dashboard.loading}</p>
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
        greeting={greeting}
      />

      <PageContainer maxWidth="xl" withGradient={false} className="py-0 pb-8">
        <div className="space-y-8">
          <MyEventsList events={myEvents} isLoading={isMyEventsLoading} />
          <UpcomingSection
            events={upcomingEvents}
            isLoading={isUpcomingLoading}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default Dashboard;
