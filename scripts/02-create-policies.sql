-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Field configs policies
create policy "Users can view their own field configs"
  on public.field_configs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own field configs"
  on public.field_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own field configs"
  on public.field_configs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own field configs"
  on public.field_configs for delete
  using (auth.uid() = user_id);

-- Time entries policies
create policy "Users can view their own time entries"
  on public.time_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own time entries"
  on public.time_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own time entries"
  on public.time_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own time entries"
  on public.time_entries for delete
  using (auth.uid() = user_id);
