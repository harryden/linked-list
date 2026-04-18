import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { analytics } from "@/lib/analytics";

export type FeedbackType = "bug" | "feature" | "other";

interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  page_path?: string;
}

interface FeedbackInsert {
  type: FeedbackType;
  message: string;
  page_path?: string;
  user_id?: string;
  user_agent: string;
}

export const useFeedback = () => {
  return useMutation({
    mutationFn: async (payload: FeedbackPayload) => {
      const { data: session } = await supabase.auth.getSession();

      const insert: FeedbackInsert = {
        ...payload,
        user_id: session?.session?.user?.id,
        user_agent: window.navigator.userAgent,
      };

      const { error } = await supabase.from("feedback").insert(insert);

      if (error) throw error;

      analytics.track("feedback_submitted", { type: payload.type });
    },
  });
};
