import { useEffect, useMemo, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
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

const useSession = (navigate: NavigateFunction) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

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

  return { userId, isSessionLoading };
};

const getDashboardGreeting = (
  profileName: string | undefined,
  myEventsCount: number,
  upcomingEventsCount: number,
) => {
  if (myEventsCount === 0 && upcomingEventsCount === 0) {
    return TEXT.dashboard.greetings.newJoiner;
  }

  if (myEventsCount === 0 && upcomingEventsCount === 1) {
    return TEXT.dashboard.greetings.firstCheckIn;
  }

  if (myEventsCount === 1 && upcomingEventsCount === 0) {
    return TEXT.dashboard.greetings.firstHost;
  }

  return TEXT.dashboard.greetings.welcomeBack.replace(
    "{name}",
    profileName ?? "friend",
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userId, isSessionLoading } = useSession(navigate);

  const { data: profile, isLoading: isProfileLoading } = useMyProfile(
    userId ?? undefined,
  );

  const { data: myEventsData, isLoading: isMyEventsLoading } = useMyEvents(
    userId ?? undefined,
    { enabled: Boolean(userId) },
  );

  const { data: upcomingEventsData, isLoading: isUpcomingLoading } =
    useUpcoming(userId ?? undefined, { enabled: Boolean(userId) });

  const myEvents = useMemo(
    () =>
      (myEventsData ?? []).map((event) => ({
        id: event.id,
        name: event.name,
        slug: event.slug,
        starts_at: event.starts_at ?? null,
      })),
    [myEventsData],
  );

  const upcomingEvents = useMemo(
    () =>
      (upcomingEventsData ?? []).map((event) => ({
        id: event.id,
        name: event.name,
        slug: event.slug,
        starts_at: event.starts_at ?? null,
      })),
    [upcomingEventsData],
  );

  const isInitialLoading = isSessionLoading || isProfileLoading;

  const greeting = useMemo(
    () =>
      getDashboardGreeting(
        profile?.name,
        myEvents.length,
        upcomingEvents.length,
      ),
    [profile?.name, myEvents.length, upcomingEvents.length],
  );

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
