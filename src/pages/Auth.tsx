import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { isSafeRedirect } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getBaseUrl } from "@/lib/urls";

const Auth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("redirect");

    if (isSafeRedirect(fromQuery)) {
      return fromQuery as string;
    }

    return "/";
  }, [location.search]);

  useEffect(() => {
    let isActive = true;

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isActive) {
          return;
        }

        if (session) {
          navigate(redirectPath, { replace: true });
          return;
        }

        setIsSessionLoading(false);
      })
      .catch(() => {
        if (isActive) {
          setIsSessionLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [navigate, redirectPath]);

  if (isSessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-12 h-0.5 bg-border-subtle rounded-full overflow-hidden mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
          </div>
          <p className="text-[13px] text-text-secondary">
            {isLoading ? "Redirecting to LinkedIn..." : "Loading sign in..."}
          </p>
        </div>
      </div>
    );
  }

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      const safeRedirect = isSafeRedirect(redirectPath) ? redirectPath : "/";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
          scopes: "openid profile email",
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      logger.error(error, { category: "Auth" });
      const message =
        error instanceof Error ? error.message : TEXT.auth.toast.failure;
      toast({
        variant: "destructive",
        description: message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={22} />
          <span className="text-[13px] font-semibold tracking-[-0.3px]">
            Linked List
          </span>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-text-secondary">
            Close
          </Button>
        </Link>
      </div>

      {/* Form area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-[400px]">
          <div className="text-[11px] font-mono text-text-secondary tracking-[1px]">
            SIGN IN
          </div>
          <h2 className="text-[28px] font-semibold tracking-[-0.5px] leading-[1.15] mt-3">
            Pick up where you left off.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-3">
            Linked List uses your LinkedIn profile so you always arrive with the
            right name tag.
          </p>

          <div className="mt-8">
            <Button
              variant="linkedin"
              size="xl"
              className="w-full gap-2"
              onClick={handleLinkedInSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-8 h-0.5 bg-white/20 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-white animate-loader-slide" />
                </div>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              )}
              {isLoading
                ? TEXT.auth.card.buttonLoading
                : TEXT.auth.card.buttonIdle}
            </Button>
          </div>

          {/* Data access info section */}
          <div className="mt-8 pt-8 border-t border-border-subtle">
            <div className="text-[11px] font-mono text-text-secondary tracking-[1px] mb-4">
              {TEXT.auth.info.title.toUpperCase()}
            </div>
            <div className="space-y-4">
              {TEXT.auth.info.items.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-text-secondary"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-text-secondary mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed mt-6">
              {TEXT.auth.info.consentPrefix}{" "}
              <a
                href="https://www.linkedin.com/mypreferences/d/data-sharing-for-permitted-services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-linkedin hover:underline font-medium"
              >
                {" "}
                LinkedIn settings
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-[11px] font-mono text-text-secondary">
              OR
            </span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <Link to="/join-event" state={{ fromAuth: true }}>
            <Button variant="outline" size="lg" className="w-full">
              Enter event code
            </Button>
          </Link>

          <p className="text-xs text-text-secondary leading-relaxed mt-8 text-center">
            By continuing you agree to the Terms and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-border-subtle flex justify-between font-mono text-[11px] text-text-secondary">
        <span>&copy; 2025</span>
        <span>Precision Utility</span>
      </div>
    </div>
  );
};

export default Auth;
