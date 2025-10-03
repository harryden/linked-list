import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();

  // Check if coming from dashboard, default to home
  const fromDashboard = routerLocation.state?.fromDashboard;
  const backPath = fromDashboard ? "/dashboard" : "/";
  const backText = fromDashboard ? "Back to Dashboard" : "Back to Home";

  const generateSlug = (name: string) => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to create events");
        navigate("/auth");
        return;
      }

      const slug = generateSlug(name);

      const { data, error } = await supabase
        .from("events")
        .insert({
          name,
          slug,
          location: eventLocation || null,
          starts_at: startsAt || null,
          linkedin_event_url: linkedinUrl || null,
          organizer_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Event created successfully!");
      navigate(`/event-success/${slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">LinkBack</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={backPath}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backText}
            </Button>
          </Link>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Create New Event</CardTitle>
              <CardDescription>
                Fill in the details below to generate your event QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Summer Tech Meetup 2025"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <LocationAutocomplete
                    id="location"
                    value={eventLocation}
                    onChange={setEventLocation}
                    placeholder="TechHub Conference Center, San Francisco"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="starts_at">Start Date & Time</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">
                    LinkedIn Event URL (optional)
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    placeholder="https://www.linkedin.com/events/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full h-12 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating Event..."
                    : "Create Event & Generate QR Code"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
