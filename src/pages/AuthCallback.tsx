import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { QrCode } from "lucide-react";
import { TEXT } from "@/constants/text";
import { isSafeRedirect } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { logger } from "@/lib/logger";

const AuthCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [hasHandledProfile, setHasHandledProfile] = useState(false);

  const redirectPath = (() => {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return isSafeRedirect(next) ? (next as string) : "/";
  })();

  const {
    data: _profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useMyProfile(userId ?? undefined);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      logger.error(error, {
        category: "Auth",
        extra: { errorDescription },
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: errorDescription || TEXT.authCallback.toast.genericFailure,
      });
      setStatus("error");
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    const handleAuthChange = (event, session, subscription) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        setUserId(session.user.id);
        subscription.unsubscribe();
        return;
      }

      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: TEXT.authCallback.toast.noSession,
        });
        setStatus("error");
        subscription.unsubscribe();
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session, subscription);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.search, navigate]);

  useEffect(() => {
    if (!userId || isProfileLoading || hasHandledProfile) {
      return;
    }

    if (profileError) {
      logger.error(profileError, { category: "Auth" });
      toast({
        variant: "destructive",
        title: "Error",
        description: TEXT.authCallback.toast.loadProfileFailure,
      });
      setStatus("error");
      setHasHandledProfile(true);
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    analytics.identify(userId, { name: _profile?.name });

    toast({
      title: "Success",
      description: TEXT.authCallback.toast.success,
    });
    setHasHandledProfile(true);
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
