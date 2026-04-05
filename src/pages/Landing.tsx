import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { TEXT } from "@/constants/text";
import HeroSection from "./landing/components/HeroSection";
import FeaturesGrid from "./landing/components/FeaturesGrid";
import HowItWorks from "./landing/components/HowItWorks";
import FooterCTA from "./landing/components/FooterCTA";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-display font-black text-xl tracking-tight">
            LinkBack
          </span>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguage("sv")}>
                  Svenska
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t("common.buttons.myEvents")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  aria-label={TEXT.common.buttons.signOut}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-linkedin hover:bg-linkedin/10"
                >
                  {t("common.buttons.signInWithLinkedIn")}
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

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>{t("common.copy.footer")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
