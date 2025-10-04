-- Grant organizers explicit permissions to delete events and related attendance rows.

DROP POLICY IF EXISTS "Organizers can delete own events" ON public.events;

CREATE POLICY "Organizers can delete own events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can delete event attendance" ON public.attendances;

CREATE POLICY "Organizers can delete event attendance"
  ON public.attendances
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = attendances.event_id
        AND e.organizer_id = auth.uid()
    )
  );
