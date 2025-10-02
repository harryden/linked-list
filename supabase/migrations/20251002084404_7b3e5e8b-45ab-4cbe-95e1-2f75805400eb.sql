-- Remove role restriction from events creation policy
DROP POLICY IF EXISTS "Organizers can create events" ON public.events;

-- Allow any authenticated user to create events
CREATE POLICY "Users can create events" 
ON public.events 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = organizer_id);

-- Update the policy name/description for clarity
COMMENT ON POLICY "Users can create events" ON public.events IS 'Any authenticated user can create events for themselves';