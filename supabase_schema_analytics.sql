-- Create a table to track daily system stats
create table daily_stats (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique default current_date,
  total_users int default 0,
  active_users_today int default 0,
  avg_mastery_score numeric default 0,
  total_events_logged int default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table daily_stats enable row level security;

-- Create a policy that allows everyone to read (for now, or restrict to admins)
create policy "Allow public read access" on daily_stats for select using (true);

-- Create a policy that allows authenticated users (admins) to insert/update
create policy "Allow authenticated insert/update" on daily_stats for all using (auth.role() = 'authenticated');
