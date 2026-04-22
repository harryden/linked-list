import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Bug, Lightbulb, MessageSquare, LogIn } from "lucide-react";
import { useFeedback, FeedbackType } from "@/hooks/useFeedback";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackDialog = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("other");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const submitFeedback = useFeedback();

  useEffect(() => {
    let isMounted = true;
    if (open) {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setIsAuthenticated(!!data.session);
        }
      };
      checkAuth();
    }
    return () => {
      isMounted = false;
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated) return;

    try {
      await submitFeedback.mutateAsync({
        type,
        message,
        page_path: location.pathname,
      });

      toast({
        title: "Thank you!",
        description: "Your feedback helps us make Linked List better.",
      });

      setMessage("");
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: unknown }).message)
            : "";

      const isAuthError = errorMessage === "Authentication required to submit feedback";

      toast({
        title: isAuthError ? "Sign in required" : "Error",
        variant: "destructive",
        description: isAuthError
          ? "Please sign in to your account to send feedback."
          : "Could not send feedback. Please try again later.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 rounded bg-background/80 backdrop-blur-sm border-border-subtle hover:border-border-strong transition-all z-50"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            {isAuthenticated === false
              ? "Please sign in to send feedback and help us improve."
              : "Have a suggestion or found a bug? We'd love to hear from you."}
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated === false ? (
          <div className="pt-4">
            <Link to={`/auth?next=${encodeURIComponent(location.pathname)}`}>
              <Button className="w-full gap-2 py-6 text-base" variant="linkedin">
                <LogIn className="h-5 w-5" />
                Sign in to send feedback
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="flex justify-between gap-2">
              {[
                { id: "bug", label: "Bug", icon: Bug },
                { id: "feature", label: "Idea", icon: Lightbulb },
                { id: "other", label: "Other", icon: MessageSquare },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={type === item.id}
                  onClick={() => setType(item.id as FeedbackType)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    type === item.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <Textarea
              placeholder={
                type === "bug"
                  ? "What happened? (Optional: steps to reproduce)"
                  : type === "feature"
                    ? "What would you like to see added to Linked List?"
                    : "Your message..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-full rounded"
                disabled={submitFeedback.isPending || !message.trim()}
              >
                {submitFeedback.isPending ? "Sending..." : "Send Feedback"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
