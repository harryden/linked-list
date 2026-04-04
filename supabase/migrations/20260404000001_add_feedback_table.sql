-- Create feedback table
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  type text not null check (type in ('bug', 'feature', 'other')),
  message text not null,
  page_path text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Allow anyone to insert (so guests can give feedback too)
create policy "Anyone can insert feedback"
  on public.feedback for insert
  with check (true);

-- Only allow admins/owners to view (currently just public for simplicity, but restricted in practice)
create policy "Admins can view feedback"
  on public.feedback for select
  using (auth.uid() in (select id from public.profiles where role = 'admin'));
