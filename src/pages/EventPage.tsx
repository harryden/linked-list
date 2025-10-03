import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeDialog } from "@/components/QRCodeDialog";

interface Event {
  id: string;
  name: string;
  slug: string;
  starts_at?: string;
  linkedin_event_url?: string;
  organizer_id: string;
  location?: string;
}

interface Attendee {
  id: string;
  name: string;
  headline?: string;
  avatar_url?: string;
  linkedin_id?: string;
}

interface Organizer {
  id: string;
  name: string;
  headline?: string;
}

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [eventCode, setEventCode] = useState<string>("");
  const [organizer, setOrganizer] = useState<Organizer | null>(null);

  useEffect(() => {
    loadEventData();
  }, [slug]);

  const loadEventData = async () => {
    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      setCurrentUserId(userId);

      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);
      setIsOrganizer(userId === eventData.organizer_id);

      // Fetch organizer profile
      const { data: organizerData } = await supabase
        .from("profiles")
        .select("id, name, headline")
        .eq("id", eventData.organizer_id)
        .single();

      if (organizerData) {
        setOrganizer(organizerData);
      }

      // Generate 6-digit event code from event ID
      const code = Math.abs(
        parseInt(eventData.id.replace(/-/g, "").substring(0, 8), 16) % 1000000,
      )
        .toString()
        .padStart(6, "0");
      setEventCode(code);

      // Check if user is attending
      if (userId) {
        const { data: attendanceData } = await supabase
          .from("attendances")
          .select("id")
          .eq("event_id", eventData.id)
          .eq("user_id", userId)
          .single();

        setIsAttending(!!attendanceData);

        // If attending or organizer, load attendee list
        if (attendanceData || userId === eventData.organizer_id) {
          await loadAttendees(eventData.id);
        }
      }
    } catch (error: any) {
      console.error("Error loading event:", error);
      toast.error("Failed to load event");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendees = async (eventId: string) => {
    const { data: attendancesData } = await supabase
      .from("attendances")
      .select("user_id, profiles(*)")
      .eq("event_id", eventId);

    if (attendancesData) {
      const attendeesList = attendancesData
        .map((a: any) => a.profiles)
        .filter(Boolean);
      setAttendees(attendeesList);
    }
  };

  const handleCheckIn = async () => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("attendances").insert({
        event_id: event!.id,
        user_id: currentUserId,
        source: "manual",
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast.info("You're already checked in!");
        } else {
          throw error;
        }
      } else {
        toast.success("Checked in successfully!");
        setIsAttending(true);
        await loadAttendees(event!.id);
      }
    } catch (error: any) {
      toast.error("Failed to check in");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>
              The event you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canViewAttendees = isAttending || isOrganizer;

  // Show centered check-in card for non-attendees
  if (!currentUserId || (!isAttending && !isOrganizer)) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-8 pb-6 px-6 space-y-6">
            {/* Event Code at top */}
            {eventCode && (
              <div className="text-center">
                <span className="text-sm text-primary font-medium">
                  Event Code: {eventCode}
                </span>
              </div>
            )}

            {/* Event Name */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

              <div className="space-y-2 text-muted-foreground">
                {event.starts_at && (
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.starts_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                {organizer && (
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Hosted by {organizer.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Check-in Button */}
            {currentUserId ? (
              <div className="space-y-4">
                <Button
                  onClick={handleCheckIn}
                  size="lg"
                  className="w-full rounded-full h-12 text-base font-medium flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white"
                >
                  <Linkedin className="h-5 w-5" />
                  Check In with LinkedIn
                </Button>

                <p className="text-xs text-center text-muted-foreground px-4">
                  By checking in, you agree to share your LinkedIn profile
                  information with event attendees for networking purposes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="w-full rounded-full h-12 text-base font-medium flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                    Check In with LinkedIn
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground px-4">
                  By checking in, you agree to share your LinkedIn profile
                  information with event attendees for networking purposes.
                </p>
              </div>
            )}

            {/* View past events link */}
            {currentUserId && (
              <div className="text-center pt-2">
                <Link
                  to="/dashboard"
                  className="text-sm text-primary hover:underline"
                >
                  View your past events
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={currentUserId ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">LinkBack</span>
          </Link>
          {!currentUserId && (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {currentUserId && (
            <Link to="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          )}

          {/* Event Details */}
          <Card className="shadow-xl">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-4xl mb-2">{event.name}</CardTitle>
                <div className="flex flex-col gap-2 text-muted-foreground">
                  {eventCode && (
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      <span className="font-mono font-semibold text-foreground">
                        Event Code: {eventCode}
                      </span>
                    </div>
                  )}
                  {event.starts_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.starts_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {organizer && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Hosted by {organizer.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {isAttending && (
                <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-full w-fit">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">You're checked in!</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Organizer QR Code Button */}
              {isOrganizer && (
                <Button
                  onClick={() => setShowQRDialog(true)}
                  size="lg"
                  className="w-full rounded-full h-12 text-base font-medium"
                  variant="outline"
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  View QR Code
                </Button>
              )}

              {/* Check-in Button */}
              {!isAttending && !isOrganizer && currentUserId && (
                <Button
                  onClick={handleCheckIn}
                  size="lg"
                  className="w-full rounded-full h-12 text-base font-medium"
                >
                  Check In to This Event
                </Button>
              )}

              {!currentUserId && (
                <div className="border border-border rounded-xl p-6 text-center bg-muted/50">
                  <p className="text-muted-foreground mb-4">
                    Sign in to check in to this event and view the attendee list
                  </p>
                  <Link to="/auth">
                    <Button size="lg" className="rounded-full">
                      Sign In to Check In
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendee List */}
          {canViewAttendees && (
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-medium">
                    {attendees.length} {attendees.length === 1 ? 'Attendee' : 'Attendees'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {attendees.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {isOrganizer
                      ? "No attendees yet. Share your QR code to get people to check in!"
                      : "No attendees yet. Be the first to check in!"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-4 py-4 border-b last:border-0"
                      >
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={attendee.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {attendee.name}
                          </p>
                          {attendee.headline && (
                            <p className="text-sm text-muted-foreground truncate">
                              {attendee.headline}
                            </p>
                          )}
                        </div>
                        <Button
                          className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white"
                          onClick={() => {
                            if (attendee.linkedin_id) {
                              window.open(
                                `https://www.linkedin.com/in/${attendee.linkedin_id}`,
                                "_blank",
                              );
                            } else {
                              toast.info("LinkedIn profile not available");
                            }
                          }}
                        >
                          <Linkedin className="h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!canViewAttendees && currentUserId && (
            <Card className="shadow-xl">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Check in to this event to view the attendee list
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        eventSlug={event.slug}
        eventName={event.name}
      />
    </div>
  );
};

export default EventPage;
