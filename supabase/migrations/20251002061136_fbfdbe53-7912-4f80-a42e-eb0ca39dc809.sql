-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_id TEXT UNIQUE,
  name TEXT NOT NULL,
  headline TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'attendee' CHECK (role IN ('attendee', 'organizer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone (public attendee lists)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  starts_at TIMESTAMPTZ,
  linkedin_event_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events are viewable by everyone
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

-- Only organizers can create events
CREATE POLICY "Organizers can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    auth.uid() = organizer_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
  );

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Create attendances table
CREATE TABLE public.attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT DEFAULT 'qr' CHECK (source IN ('qr', 'manual')),
  status TEXT DEFAULT 'checked_in' CHECK (status = 'checked_in'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS on attendances
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Attendees of an event can view attendance list
CREATE POLICY "Attendees can view event attendances"
  ON public.attendances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.attendances a
      WHERE a.event_id = attendances.event_id
      AND a.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = attendances.event_id
      AND e.organizer_id = auth.uid()
    )
  );

-- Authenticated users can create attendance records
CREATE POLICY "Users can create attendance"
  ON public.attendances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at
  BEFORE UPDATE ON public.attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'attendee'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();