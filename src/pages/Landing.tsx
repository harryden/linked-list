import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { TEXT } from "@/constants/text";
import linkbackLogo from "@/assets/linkback-logo.png";
import HeroSection from "./landing/components/HeroSection";
import FeaturesGrid from "./landing/components/FeaturesGrid";
import HowItWorks from "./landing/components/HowItWorks";
import FooterCTA from "./landing/components/FooterCTA";

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
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={linkbackLogo}
              alt="LinkBack"
              className="h-16 sm:h-20 w-auto"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm sm:text-base"
                  >
                    {TEXT.common.buttons.myEvents}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="rounded-full shadow-[0_0_18px_rgba(10,102,194,0.45)] hover:shadow-[0_0_24px_rgba(10,102,194,0.6)] text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] text-sm sm:text-base"
                >
                  {TEXT.common.buttons.signInWithLinkedIn}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <HeroSection isAuthenticated={Boolean(user)} />
        <FeaturesGrid />
        <HowItWorks />
        {!user && <FooterCTA />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{TEXT.common.copy.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
