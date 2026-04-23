import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/utils";
import { TEXT } from "@/constants/text";
import { Users, Calendar } from "lucide-react";
import HeroSection from "./landing/components/HeroSection";
import FeaturesGrid from "./landing/components/FeaturesGrid";
import HowItWorks from "./landing/components/HowItWorks";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-bg-base relative">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border-subtle)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border-subtle)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 100%)",
        }}
      />

      {/* Nav */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border-subtle px-8 py-4 flex items-center justify-between transition-colors relative",
          scrolled ? "bg-bg-base/80 backdrop-blur-sm" : "bg-bg-base",
        )}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="text-[15px] font-semibold tracking-[-0.3px]">
            Linked List
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  My events
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
              <Link to="/create-event">
                <Button variant="primary" size="sm">
                  Create event
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/join-event">
                <Button variant="ghost" size="sm">
                  Join event
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Sign in
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10">
        <HeroSection isAuthenticated={Boolean(user)} />
        <FeaturesGrid />

        {/* Role Selection */}
        <section className="px-16 py-24 max-md:px-4 border-t border-border-subtle bg-bg-surface/30">
          <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1 max-w-[1000px] mx-auto">
            {/* For Hosts */}
            <div className="p-8 border border-border-subtle rounded-2xl bg-bg-base flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.3px]">
                  {TEXT.landing.roles.host.title}
                </h3>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                  {TEXT.landing.roles.host.description}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <Link to={user ? "/create-event" : "/auth"}>
                  <Button variant="outline" className="w-full h-11">
                    {TEXT.landing.roles.host.cta}
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Attendees */}
            <div className="p-8 border border-border-subtle rounded-2xl bg-bg-base flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.3px]">
                  {TEXT.landing.roles.attendee.title}
                </h3>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                  {TEXT.landing.roles.attendee.description}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <Link to="/join-event">
                  <Button variant="outline" className="w-full h-11">
                    {TEXT.landing.roles.attendee.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="px-16 py-32 flex flex-col items-center text-center max-md:px-4">
          <div className="max-w-[480px]">
            <h2 className="text-[40px] font-semibold tracking-[-1px] leading-[1.05]">
              Ready to simplify your check-ins?
            </h2>
            <p className="text-text-secondary mt-5 text-lg leading-relaxed">
              Join dozens of organizers already using Linked List for their
              professional community events.
            </p>
            <div className="mt-10 flex gap-3 justify-center max-md:flex-col">
              <Link to={user ? "/create-event" : "/auth"}>
                <Button
                  variant={user ? "primary" : "linkedin"}
                  size="lg"
                  className="px-10 h-12"
                >
                  {user ? "Create your first event" : "Sign in with LinkedIn"}
                </Button>
              </Link>
              {!user && (
                <Link to="/join-event">
                  <Button variant="outline" size="lg" className="px-10 h-12">
                    Join with code
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 pt-24 border-t border-border-subtle">
        <div className="container mx-auto px-4 pb-8 text-center text-sm text-text-secondary">
          <p>© 2025 Linked List. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
