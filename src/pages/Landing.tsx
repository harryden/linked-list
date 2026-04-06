import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import GradientBackground from "./landing/components/GradientBackground";
import LandingNav from "./landing/components/LandingNav";
import HeroSection from "./landing/components/HeroSection";
import HowItWorks from "./landing/components/HowItWorks";
import FooterCTA from "./landing/components/FooterCTA";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
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
    <div
      style={
        {
          position: "relative",
          minHeight: "100vh",
          "--font-brand": "'Plus Jakarta Sans', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <GradientBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <LandingNav user={user} onSignOut={handleSignOut} />
        <HeroSection />
        <HowItWorks />
        {!user && <FooterCTA />}
      </div>
    </div>
  );
};

export default Landing;
