import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  Settings,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { useMyEvents } from "@/hooks/useEvents";
import { useUpcoming } from "@/hooks/useAttendances";
import { useMyProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/utils";
import MyEventsList from "./dashboard/components/MyEventsList";
import UpcomingSection from "./dashboard/components/UpcomingSection";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My events", icon: Calendar },
  { label: "Attendees", icon: Users },
  { label: "Check-in codes", icon: QrCode },
  { label: "Settings", icon: Settings },
] as const;

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

    void loadSession();
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
  const { toast } = useToast();
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
        location: event.location ?? null,
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
    toast({
      description: TEXT.dashboard.header.signOutSuccess,
    });
    navigate("/");
  };

  const userInitials = profile?.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4" />
          <p className="text-text-secondary">{TEXT.dashboard.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface flex flex-row">
      {/* Sidebar */}
      <aside className="w-60 bg-bg-base border-r border-border-subtle flex flex-col p-4 gap-1 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 px-2 pb-5 pt-2">
          <LogoMark size={22} />
          <span className="text-[13px] font-semibold tracking-[-0.3px]">
            LinkBack
          </span>
        </Link>

        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium cursor-pointer",
              item.active
                ? "bg-bg-surface-hover text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
            )}
          >
            <item.icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
            {item.label}
          </div>
        ))}

        <div className="flex-1" />

        {/* User chip */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle w-full text-left hover:bg-bg-surface-hover transition-colors"
          title={TEXT.common.buttons.signOut}
        >
          <div className="w-7 h-7 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[11px] font-medium text-text-secondary flex-shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate">
              {profile?.name ?? "You"}
            </div>
            <div className="text-[11px] text-text-secondary truncate">
              {profile?.headline ?? ""}
            </div>
          </div>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-10 py-8">
        {/* Greeting row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono text-text-secondary tracking-[1px]">
              DASHBOARD
            </div>
            <h1 className="text-[32px] font-semibold tracking-[-0.8px] mt-2">
              {greeting}
            </h1>
            <div className="text-sm text-text-secondary mt-1.5">
              {myEvents.length} events hosted · {upcomingEvents.length} attended
            </div>
          </div>
          <Link to="/create-event" state={{ fromDashboard: true }}>
            <Button variant="primary" size="md" className="gap-2">
              <Plus
                className="h-3.5 w-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              Create event
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              l: "Events hosted",
              v: String(myEvents.length),
              d: "total",
            },
            {
              l: "Attending",
              v: String(upcomingEvents.length),
              d: "upcoming",
            },
            { l: "Check-in rate", v: "—", d: "across all events" },
            { l: "Connections", v: "—", d: "via check-ins" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-bg-base border border-border-subtle rounded-xl p-4"
            >
              <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px] uppercase">
                {s.l}
              </div>
              <div className="text-[28px] font-semibold tracking-[-0.8px] mt-2 tabular-nums">
                {s.v}
              </div>
              <div className="text-[12px] text-text-secondary mt-1">{s.d}</div>
            </div>
          ))}
        </div>

        {/* Lists */}
        <div className="space-y-8">
          <MyEventsList events={myEvents} isLoading={isMyEventsLoading} />
          <UpcomingSection
            events={upcomingEvents}
            isLoading={isUpcomingLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
