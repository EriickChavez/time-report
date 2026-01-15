-- Esta función crea los campos por defecto para un usuario
create or replace function public.create_default_fields_for_user(user_uuid uuid)
returns void as $$
begin
  insert into public.field_configs (user_id, field_id, label, type, required, enabled, "order")
  values
    (user_uuid, 'date', 'Día', 'date', true, true, 1),
    (user_uuid, 'time', 'Hora', 'timerange', true, true, 2),
    (user_uuid, 'reporter', 'Quien Reporta', 'text', true, true, 3),
    (user_uuid, 'evidence', 'Evidencia', 'textarea', false, true, 4),
    (user_uuid, 'observations', 'Observaciones', 'textarea', false, true, 5),
    (user_uuid, 'status', 'Status', 'select', true, true, 6);
end;
$$ language plpgsql;

-- Actualizar el trigger para crear campos por defecto
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Crear campos por defecto
  perform public.create_default_fields_for_user(new.id);
  
  return new;
end;
$$ language plpgsql security definer;
