import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/hooks/useSupabaseData";
import { toast } from "sonner";
import { QrCode } from "lucide-react";
import { TEXT } from "@/constants/text";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [hasHandledProfile, setHasHandledProfile] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>("/");

  const {
    data: _profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useMyProfile(userId ?? undefined);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const errorDescription = params.get("error_description");
        const redirectParam = params.get("redirect");

        let resolvedRedirect = "/";

        if (redirectParam && redirectParam.startsWith("/")) {
          resolvedRedirect = redirectParam;
        } else if (typeof window !== "undefined") {
          const stored = sessionStorage.getItem("postAuthRedirect");

          if (stored && stored.startsWith("/")) {
            resolvedRedirect = stored;
          }
        }

        setRedirectPath(resolvedRedirect);

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          toast.error(
            errorDescription || TEXT.authCallback.toast.genericFailure,
          );
          setStatus("error");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postAuthRedirect");
          }
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error(TEXT.authCallback.toast.sessionFailure);
          setStatus("error");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postAuthRedirect");
          }
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        if (!session) {
          toast.error(TEXT.authCallback.toast.noSession);
          setStatus("error");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postAuthRedirect");
          }
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        setUserId(session.user.id);
      } catch (error: unknown) {
        console.error("Auth callback error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : TEXT.authCallback.toast.genericFailure,
        );
        setStatus("error");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("postAuthRedirect");
        }
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  useEffect(() => {
    if (!userId || isProfileLoading || hasHandledProfile) {
      return;
    }

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      toast.error(TEXT.authCallback.toast.loadProfileFailure);
      setStatus("error");
      setHasHandledProfile(true);
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    toast.success(TEXT.authCallback.toast.success);
    setHasHandledProfile(true);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("postAuthRedirect");
    }
    navigate(redirectPath, { replace: true });
  }, [
    hasHandledProfile,
    isProfileLoading,
    navigate,
    profileError,
    redirectPath,
    userId,
  ]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <QrCode className="h-16 w-16 text-primary animate-pulse" />
        </div>

        {status === "loading" ? (
          <>
            <h1 className="text-2xl font-bold">
              {TEXT.authCallback.loadingTitle}
            </h1>
            <p className="text-muted-foreground">
              {TEXT.authCallback.loadingDescription}
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-destructive">
              {TEXT.authCallback.errorTitle}
            </h1>
            <p className="text-muted-foreground">
              {TEXT.authCallback.errorDescription}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
