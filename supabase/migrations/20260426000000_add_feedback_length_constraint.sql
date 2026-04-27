ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000);
