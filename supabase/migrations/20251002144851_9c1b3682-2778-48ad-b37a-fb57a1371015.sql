-- Update the handle_new_user function to extract LinkedIn OAuth data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, headline, avatar_url, linkedin_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      'User'
    ),
    NEW.raw_user_meta_data->>'headline',
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'sub',
    'attendee'
  );
  RETURN NEW;
END;
$function$;