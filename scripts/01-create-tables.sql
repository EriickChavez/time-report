-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create field_configs table (configuración de campos personalizados)
create table public.field_configs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  field_id text not null,
  label text not null,
  type text not null check (type in ('text', 'textarea', 'date', 'time', 'timerange', 'select', 'file')),
  required boolean default false,
  enabled boolean default true,
  allow_files boolean default false,
  options jsonb default '[]'::jsonb,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, field_id)
);

-- Create time_entries table (registros de tiempo)
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  start_time time,
  end_time time,
  reporter text,
  status text default 'pending',
  field_data jsonb default '{}'::jsonb,
  files jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index time_entries_user_id_idx on public.time_entries(user_id);
create index time_entries_date_idx on public.time_entries(date);
create index field_configs_user_id_idx on public.field_configs(user_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.field_configs enable row level security;
alter table public.time_entries enable row level security;

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_field_configs_updated_at before update on public.field_configs
  for each row execute procedure public.handle_updated_at();

create trigger handle_time_entries_updated_at before update on public.time_entries
  for each row execute procedure public.handle_updated_at();
