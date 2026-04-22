import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { LayoutDashboard, Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { useMyEvents } from "@/hooks/useEvents";
import { useUpcoming } from "@/hooks/useAttendances";
import { useMyProfile } from "@/hooks/useProfile";
import { getDashboardGreeting } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/utils";
import MyEventsList from "./dashboard/components/MyEventsList";
import UpcomingSection from "./dashboard/components/UpcomingSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
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

      if (isMounted) {
        if (!session) {
          navigate("/auth");
        } else {
          setUserId(session.user.id);
        }
        setIsSessionLoading(false);
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (!session) {
          navigate("/auth");
        } else {
          setUserId(session?.user?.id ?? null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { userId, isSessionLoading };
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

  const { myEventsUpcoming, myEventsPast } = useMemo(() => {
    const now = Date.now();
    const sorted = [...(myEventsData ?? [])].sort((a, b) => {
      const dateA = a.starts_at ? new Date(a.starts_at).getTime() : 0;
      const dateB = b.starts_at ? new Date(b.starts_at).getTime() : 0;
      return dateB - dateA;
    });

    return {
      myEventsUpcoming: sorted.filter((e) => {
        if (!e.starts_at) return true;
        return new Date(e.starts_at).getTime() > now - 8 * 60 * 60 * 1000;
      }),
      myEventsPast: sorted.filter((e) => {
        if (!e.starts_at) return false;
        return new Date(e.starts_at).getTime() <= now - 8 * 60 * 60 * 1000;
      }),
    };
  }, [myEventsData]);

  const { attendedUpcoming, attendedPast } = useMemo(() => {
    const now = Date.now();
    const sorted = [...(upcomingEventsData ?? [])].sort((a, b) => {
      const dateA = a.starts_at ? new Date(a.starts_at).getTime() : 0;
      const dateB = b.starts_at ? new Date(b.starts_at).getTime() : 0;
      return dateB - dateA;
    });

    return {
      attendedUpcoming: sorted.filter((e) => {
        if (!e.starts_at) return true;
        return new Date(e.starts_at).getTime() > now - 8 * 60 * 60 * 1000;
      }),
      attendedPast: sorted.filter((e) => {
        if (!e.starts_at) return false;
        return new Date(e.starts_at).getTime() <= now - 8 * 60 * 60 * 1000;
      }),
    };
  }, [upcomingEventsData]);

  const TABS = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ] as const;

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("upcoming");

  const isInitialLoading = isSessionLoading || isProfileLoading;

  const greeting = useMemo(
    () =>
      getDashboardGreeting(
        profile?.name,
        myEventsUpcoming.length,
        attendedUpcoming.length,
      ),
    [profile?.name, myEventsUpcoming.length, attendedUpcoming.length],
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
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-0.5 bg-border-subtle rounded-full overflow-hidden mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
          </div>
          <p className="text-sm text-text-secondary">
            {TEXT.dashboard.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col md:flex-row">
      <aside className="w-full md:w-60 bg-bg-base border-b md:border-b-0 md:border-r border-border-subtle flex flex-col p-4 gap-1 flex-shrink-0 max-h-screen overflow-y-auto">
        <Link to="/" className="flex items-center gap-2.5 px-2 pb-5 pt-2">
          <LogoMark size={22} />
          <span className="text-[13px] font-semibold tracking-[-0.3px]">
            LinkBack
          </span>
        </Link>

        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to="/dashboard"
              className={cn(
                "flex items-center gap-2.5 h-9 px-2.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap",
                item.active
                  ? "bg-bg-surface-hover text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
              )}
            >
              <item.icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block flex-1" />

        <div className="mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle w-full text-left bg-bg-base hover:bg-bg-surface-hover transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                <div className="w-7 h-7 rounded-full bg-bg-surface-hover border border-border-subtle flex items-center justify-center text-[11px] font-medium text-text-secondary flex-shrink-0">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">
                    {profile?.name ?? "You"}
                  </div>
                  <div className="text-[11px] text-text-secondary truncate">
                    {profile?.email ?? ""}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "top"
                  : "right"
              }
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-state-error focus:text-state-error focus:bg-state-error-bg cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.8px] mt-2 leading-none">
              {greeting}
            </h1>
            <div className="text-[13px] text-text-secondary mt-2">
              {myEventsUpcoming.length + myEventsPast.length} events hosted ·{" "}
              {attendedUpcoming.length + attendedPast.length} attended
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

        <div className="flex gap-6 border-b border-border-subtle mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-[13px] font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-12 mb-12">
          {[
            {
              l: "Events hosted",
              v: (myEventsUpcoming.length + myEventsPast.length).toString(),
            },
            {
              l: "Total attendees",
              v: "—",
            },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[11px] font-mono text-text-secondary tracking-[0.8px] uppercase">
                {s.l}
              </div>
              <div className="text-[24px] font-semibold tracking-[-0.5px] mt-1 tabular-nums">
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <MyEventsList
            events={(activeTab === "upcoming"
              ? myEventsUpcoming
              : myEventsPast
            ).map((e) => ({
              id: e.id,
              name: e.name,
              slug: e.slug,
              starts_at: e.starts_at ?? null,
              location: e.location ?? null,
            }))}
            isLoading={isMyEventsLoading}
            title={activeTab === "upcoming" ? "My events" : "Past events"}
          />
          <UpcomingSection
            events={(activeTab === "upcoming"
              ? attendedUpcoming
              : attendedPast
            ).map((e) => ({
              id: e.id,
              name: e.name,
              slug: e.slug,
              starts_at: e.starts_at ?? null,
            }))}
            isLoading={isUpcomingLoading}
            title={activeTab === "upcoming" ? "Attending" : "Attended"}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
