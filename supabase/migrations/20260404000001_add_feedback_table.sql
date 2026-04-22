CREATE TABLE public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id),
  type text NOT NULL CHECK (type IN ('bug', 'feature', 'other')),
  message text NOT NULL,
  page_path text,
  user_agent text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
