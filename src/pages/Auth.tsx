import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { QrCode, Linkedin, Shield, Users, Lock } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "openid profile email",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <QrCode className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">LinkBack</span>
          </Link>
          <p className="text-xl text-muted-foreground">
            Professional event check-in
          </p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl">Sign in with LinkedIn</CardTitle>
            <p className="text-sm text-muted-foreground">
              Authenticate securely using your LinkedIn account
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <Button
              onClick={handleLinkedInSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full rounded-full h-12 text-base font-medium bg-[#0A66C2] hover:bg-[#004182] text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connecting to LinkedIn...
                </>
              ) : (
                <>
                  <Linkedin className="h-5 w-5 mr-2" />
                  Continue with LinkedIn
                </>
              )}
            </Button>

            <div className="space-y-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-center text-foreground">
                What we access:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Your name and profile picture
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To identify you at events
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Your headline and email
                    </p>
                    <p className="text-xs text-muted-foreground">
                      For professional networking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Read-only access</p>
                    <p className="text-xs text-muted-foreground">
                      We cannot post or message on your behalf
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By signing in, you agree to share your LinkedIn profile
                information with event organizers and attendees for networking
                purposes. You can revoke access anytime from your{" "}
                <a
                  href="https://www.linkedin.com/mypreferences/d/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "#0A66C2" }}
                >
                  LinkedIn settings
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
