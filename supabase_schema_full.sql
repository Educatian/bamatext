-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  student_state jsonb,
  updated_at timestamp with time zone default now()
);

-- Enable RLS for profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
-- Allow admins (or public for prototype) to read all profiles for the dashboard
create policy "Allow public read access" on profiles for select using (true);


-- 2. LOGS TABLE
create table if not exists logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  event_type text not null,
  payload jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS for logs
alter table logs enable row level security;
create policy "Users can insert own logs" on logs for insert with check (auth.uid() = user_id);
create policy "Allow public read access" on logs for select using (true);


-- 3. DAILY STATS TABLE
create table if not exists daily_stats (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique default current_date,
  total_users int default 0,
  active_users_today int default 0,
  avg_mastery_score numeric default 0,
  total_events_logged int default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS for daily_stats
alter table daily_stats enable row level security;
create policy "Allow public read access" on daily_stats for select using (true);
create policy "Allow authenticated insert/update" on daily_stats for all using (auth.role() = 'authenticated');


-- 4. AUTOMATION (Optional Trigger)
-- This updates the daily_stats table whenever a profile is updated
create or replace function update_daily_stats()
returns trigger as $$
begin
  insert into daily_stats (date, active_users_today, total_users)
  values (
    current_date, 
    1, 
    (select count(*) from profiles)
  )
  on conflict (date) do update
  set 
    active_users_today = active_users_today + 1,
    total_users = (select count(*) from profiles),
    updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_update on profiles;
create trigger on_profile_update
  after update on profiles
  for each row
  execute function update_daily_stats();
