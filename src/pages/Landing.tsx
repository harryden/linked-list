import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  QrCode,
  Users,
  Shield,
  Calendar,
  LogOut,
  Linkedin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">LinkBack</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="rounded-full">
                    My Events
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="rounded-full shadow-[0_0_20px_rgba(10,102,194,0.5)] hover:shadow-[0_0_30px_rgba(10,102,194,0.7)] text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                >
                  Sign in with LinkedIn
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Event Check-In,
              <br />
              <span
                className="text-primary inline-block animate-fade-in [animation-delay:0.3s] [animation-fill-mode:both] bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] bg-clip-text"
                style={{
                  textShadow:
                    "0 0 30px rgba(255, 150, 200, 0.9), 0 0 60px rgba(255, 150, 200, 0.7), 0 0 90px rgba(255, 150, 200, 0.5)",
                }}
              >
                Simplified.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {user
                ? "Streamline your event networking with LinkedIn integration. Check in instantly, connect with attendees, and build your professional network effortlessly."
                : "Create a QR code for your event. Attendees scan to check in with LinkedIn. Build verified attendee lists instantly."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <>
                  <Link to="/join-event">
                    <Button
                      size="lg"
                      className="rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg"
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      Join an Event
                    </Button>
                  </Link>
                  <Link to="/create-event">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 h-12 text-base font-medium"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Host an Event
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button
                      size="lg"
                      className="rounded-full px-8 h-12 text-base font-medium transition-all hover:shadow-lg bg-[#0A66C2] hover:bg-[#004182] text-white shadow-[0_0_20px_rgba(10,102,194,0.5)] hover:shadow-[0_0_30px_rgba(10,102,194,0.7)]"
                    >
                      <Linkedin className="h-5 w-5 mr-2" />
                      Sign in with LinkedIn
                    </Button>
                  </Link>
                  <Link to="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 h-12 text-base font-medium"
                    >
                      How It Works
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">One QR Code</h3>
              <p className="text-muted-foreground">
                Generate a unique QR code for each event. Display it at your
                venue or share the link.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">LinkedIn Verified</h3>
              <p className="text-muted-foreground">
                Authentic attendee data from LinkedIn. No fake accounts, just
                real professionals.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Lists</h3>
              <p className="text-muted-foreground">
                View who attended in real-time. Names, headlines, and profile
                links at your fingertips.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-center animate-fade-in [animation-delay:0.1s] [animation-fill-mode:both]">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                  style={{ boxShadow: "0 0 20px rgba(255, 150, 200, 0.4)" }}
                >
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Create Your Event
                  </h3>
                  <p className="text-muted-foreground">
                    Sign up as an organizer and create your event in seconds.
                    Get a unique QR code instantly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center animate-fade-in [animation-delay:0.3s] [animation-fill-mode:both]">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                  style={{ boxShadow: "0 0 20px rgba(255, 150, 200, 0.4)" }}
                >
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Attendees Check In
                  </h3>
                  <p className="text-muted-foreground">
                    Guests scan the QR code and authenticate with LinkedIn.
                    Their attendance is recorded automatically.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center animate-fade-in [animation-delay:0.5s] [animation-fill-mode:both]">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                  style={{ boxShadow: "0 0 20px rgba(255, 150, 200, 0.4)" }}
                >
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    View Attendee List
                  </h3>
                  <p className="text-muted-foreground">
                    Access the complete list of verified attendees with their
                    LinkedIn profiles, names, and headlines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-20 pb-32">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary to-primary rounded-3xl p-12 shadow-xl animate-border-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to streamline your events?
                </h2>
                <p className="text-xl text-primary-foreground/90 mb-8">
                  Join LinkBack today and start building verified attendee
                  lists.
                </p>
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-base font-medium shadow-lg hover:scale-105 transition-transform bg-[#0A66C2] hover:bg-[#004182] text-white"
                  >
                    <Linkedin className="h-5 w-5 mr-2" />
                    Sign in with LinkedIn
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 LinkBack. Powered by LinkedIn.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
