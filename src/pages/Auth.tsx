import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Linkedin, Shield, Users, Lock } from "lucide-react";
import { TEXT } from "@/constants/text";
import linkbackLogo from "@/assets/linkback-logo.png";
import { isSafeRedirect } from "@/lib/utils";
import { logger } from "@/lib/logger";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const infoItems = TEXT.auth.info.items;
  const infoIcons = [Users, Shield, Lock];

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("redirect");

    if (isSafeRedirect(fromQuery)) {
      return fromQuery as string;
    }

    return "/";
  }, [location.search]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(redirectPath, { replace: true });
      }
    });
  }, [navigate, redirectPath]);

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      const safeRedirect = isSafeRedirect(redirectPath) ? redirectPath : "/";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
          scopes: "openid profile email",
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      logger.error(error, { category: "Auth" });
      const message =
        error instanceof Error ? error.message : TEXT.auth.toast.failure;
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src={linkbackLogo} alt="LinkBack" className="h-20 w-auto" />
          </Link>
          <p className="text-xl text-muted-foreground">{TEXT.auth.tagline}</p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl">{TEXT.auth.card.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {TEXT.auth.card.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <Button
              onClick={handleLinkedInSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full rounded-full h-12 text-base font-medium bg-linkedin hover:bg-linkedin-hover text-white shadow-glow-linkedin hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {TEXT.auth.card.buttonLoading}
                </>
              ) : (
                <>
                  <Linkedin className="h-5 w-5 mr-2" />
                  {TEXT.auth.card.buttonIdle}
                </>
              )}
            </Button>

            <div className="space-y-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-center text-foreground">
                {TEXT.auth.info.title}
              </p>

              <div className="space-y-3">
                {infoItems.map((item, index) => {
                  const Icon = infoIcons[index] ?? Users;

                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                {TEXT.auth.info.consentPrefix}{" "}
                <a
                  href="https://www.linkedin.com/mypreferences/d/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium text-linkedin"
                >
                  {TEXT.auth.info.linkedInSettings}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {TEXT.auth.navigation.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
