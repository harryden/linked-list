import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/constants/text";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
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
      toast({
        variant: "destructive",
        title: "Error",
        description: errorDescription || TEXT.authCallback.toast.genericFailure,
      });
      setStatus("error");
      setTimeout(() => navigate("/auth"), 2000);
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
        toast({
          variant: "destructive",
          title: "Error",
          description: TEXT.authCallback.toast.noSession,
        });
        setStatus("error");
        subscription.unsubscribe();
        setTimeout(() => navigate("/auth"), 2000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.search, navigate, toast]);

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
    toast,
    _profile?.name,
  ]);

  if (status === "loading") {
    return (
      <LoadingScreen
        title={TEXT.authCallback.loadingTitle}
        message={TEXT.authCallback.loadingDescription}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="text-center w-full max-w-[320px]">
        <h1 className="text-[20px] font-semibold tracking-[-0.4px] text-state-error">
          {TEXT.authCallback.errorTitle}
        </h1>
        <p className="text-[13px] text-text-secondary mt-2">
          {TEXT.authCallback.errorDescription}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
