import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QrCode } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const errorDescription = params.get("error_description");

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          toast.error(errorDescription || "Authentication failed");
          setStatus("error");
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        // Wait for session to be established
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Failed to establish session");
          setStatus("error");
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        if (!session) {
          toast.error("No active session found");
          setStatus("error");
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        // Verify profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileError);
          toast.error("Failed to load profile");
          setStatus("error");
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        // Success! Redirect to dashboard
        toast.success("Successfully authenticated!");
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error(error.message || "Authentication failed");
        setStatus("error");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <QrCode className="h-16 w-16 text-primary animate-pulse" />
        </div>

        {status === "loading" ? (
          <>
            <h1 className="text-2xl font-bold">Authenticating...</h1>
            <p className="text-muted-foreground">
              Please wait while we complete your sign in
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-destructive">
              Authentication Error
            </h1>
            <p className="text-muted-foreground">
              Redirecting you back to sign in...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
