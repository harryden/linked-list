import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEXT } from "@/constants/text";
import { useCreateEvent } from "@/hooks/useSupabaseData";
import CreateEventHeader from "./create-event/components/CreateEventHeader";
import CreateEventForm from "./create-event/components/CreateEventForm";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const createEvent = useCreateEvent();

  // Check if coming from dashboard, default to home
  const fromDashboard = routerLocation.state?.fromDashboard;
  const backPath = fromDashboard ? "/dashboard" : "/";
  const backText = fromDashboard
    ? TEXT.createEvent.header.backToDashboard
    : TEXT.createEvent.header.backToHome;

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
        toast.error(TEXT.createEvent.toast.authRequired);
        navigate("/auth");
        return;
      }

      const slug = generateSlug(name);

      await createEvent.mutateAsync({
        name,
        slug,
        location: eventLocation || null,
        starts_at: startsAt || null,
        linkedin_event_url: linkedinUrl || null,
        organizer_id: session.user.id,
      });

      toast.success(TEXT.createEvent.toast.success);
      navigate(`/event-success/${slug}`);
    } catch (error: any) {
      toast.error(error.message || TEXT.createEvent.toast.failure);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <CreateEventHeader backPath={backPath} backText={backText} />

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <CreateEventForm
            name={name}
            location={eventLocation}
            startsAt={startsAt}
            linkedinUrl={linkedinUrl}
            isSubmitting={isLoading}
            onNameChange={setName}
            onLocationChange={setEventLocation}
            onStartsAtChange={setStartsAt}
            onLinkedinUrlChange={setLinkedinUrl}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
