import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  QrCode,
  Plus,
  Calendar,
  Users,
  LogOut,
  Camera,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { QRScanner } from "@/components/QRScanner";

interface Profile {
  id: string;
  name: string;
  role: string;
  headline?: string;
  avatar_url?: string;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  starts_at?: string;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);

      // Fetch user's created events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", session.user.id)
        .order("created_at", { ascending: false });

      if (eventsData) setEvents(eventsData);

      // Fetch attended events
      const { data: attendancesData } = await supabase
        .from("attendances")
        .select("event_id, events(*)")
        .eq("user_id", session.user.id);

      if (attendancesData) {
        setAttendedEvents(
          attendancesData.map((a: any) => a.events).filter(Boolean),
        );
      }
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleQRScan = async (eventSlug: string) => {
    try {
      // Fetch the event by slug
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("id")
        .eq("slug", eventSlug)
        .single();

      if (eventError || !eventData) {
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

      // Check in to the event
      const { error: attendanceError } = await supabase
        .from("attendances")
        .insert({
          event_id: eventData.id,
          user_id: session.user.id,
          source: "qr",
        });

      if (attendanceError) {
        if (attendanceError.code === "23505") {
          toast.info("You're already checked in to this event!");
        } else {
          throw attendanceError;
        }
      } else {
        toast.success("Checked in successfully!");
        // Refresh the attended events list
        checkAuth();
      }

      // Navigate to the event page
      navigate(`/event/${eventSlug}`);
    } catch (error) {
      console.error("Error checking in:", error);
      toast.error("Failed to check in");
    }
  };

  if (isLoading) {
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
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">LinkBack</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <p className="font-medium">{profile?.name}</p>
                {profile?.headline && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {profile.headline}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {profile?.name}!
            </h1>
            <p className="text-muted-foreground">
              Host events, check in to events, and connect with attendees.
            </p>
          </div>

          {/* Your Events Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Events</h2>

            {events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    Ready to host your first event?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your QR in under 10 seconds.
                  </p>
                  <Link to="/create-event" state={{ fromDashboard: true }}>
                    <Button className="rounded-full">
                      Create Your First Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <Link key={event.id} to={`/event/${event.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          {event.starts_at
                            ? new Date(event.starts_at).toLocaleDateString()
                            : "Date not set"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Users className="h-4 w-4" />
                          <span>View attendees →</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Attended Events Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Events You've Attended
            </h2>

            {attendedEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    No check-ins yet.
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Scan a QR or enter a 6-digit code to get started.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setShowScanner(true)}
                      className="rounded-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                    <Link to="/join-event" state={{ fromDashboard: true }}>
                      <Button variant="outline" className="rounded-full">
                        Join by Code
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {attendedEvents.map((event) => (
                  <Link key={event.id} to={`/event/${event.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          {event.starts_at
                            ? new Date(event.starts_at).toLocaleDateString()
                            : "Date not set"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Users className="h-4 w-4" />
                          <span>View attendee list →</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
