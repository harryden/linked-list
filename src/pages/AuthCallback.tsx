import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
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
    const next = params.get("next") ?? params.get("redirect");
    return isSafeRedirect(next) ? (next as string) : "/";
  })();

  const {
    isLoading: isProfileLoading,
    error: profileError,
    data: _profile,
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
      setStatus("error");
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        setUserId(session.user.id);
        return;
      }

      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        setStatus("error");
        subscription.unsubscribe();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.search]);

  useEffect(() => {
    if (!userId || isProfileLoading || hasHandledProfile) {
      return;
    }

    if (profileError) {
      logger.error(profileError, { category: "Auth" });
      setStatus("error");
      setHasHandledProfile(true);
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
    toast,
    _profile?.name,
  ]);

  if (status === "error") {
    return (
      <ErrorScreen
        title={TEXT.authCallback.errorTitle}
        message={TEXT.authCallback.errorDescription}
        backPath="/auth"
        backLabel="Back to Sign In"
      />
    );
  }

  return (
    <LoadingScreen
      title={TEXT.authCallback.loadingTitle}
      message={TEXT.authCallback.loadingDescription}
    />
  );
};

export default AuthCallback;
