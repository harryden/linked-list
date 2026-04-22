import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/utils";
import HeroSection from "./landing/components/HeroSection";
import FeaturesGrid from "./landing/components/FeaturesGrid";

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
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          )}
          <Link to={user ? "/create-event" : "/auth"}>
            <Button variant="primary" size="sm">
              Create event
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <HeroSection isAuthenticated={Boolean(user)} />
        <FeaturesGrid />

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
                <Button variant="primary" size="lg" className="px-10 h-12">
                  {user ? "Create your first event" : "Sign in with LinkedIn"}
                </Button>
              </Link>
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
