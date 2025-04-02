-- Criar schema se não existir
create schema if not exists public;

-- Garantir permissões do schema public
alter default privileges in schema public grant all on tables to authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on tables to anon;
alter default privileges in schema public grant all on sequences to authenticated;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on sequences to anon;
alter default privileges in schema public grant all on functions to authenticated;
alter default privileges in schema public grant all on functions to service_role;
alter default privileges in schema public grant all on functions to anon;
alter default privileges in schema public grant all on types to authenticated;
alter default privileges in schema public grant all on types to service_role;
alter default privileges in schema public grant all on types to anon;

grant usage on schema public to authenticated;
grant usage on schema public to service_role;
grant usage on schema public to anon;
grant create on schema public to authenticated;
grant create on schema public to service_role;
grant create on schema public to anon;

-- Garantir que a view materializada existe
create materialized view if not exists public.meal_confirmation_counts as
select 
  date,
  meal_type,
  count(*) filter (where status = true) as confirmed_count,
  count(*) filter (where status = false) as declined_count
from public.meal_confirmations
group by date, meal_type;

-- Garantir que a view é atualizada automaticamente
create or replace function public.refresh_meal_confirmation_counts()
returns trigger as $$
declare
  v_date date;
  v_meal_type text;
begin
  -- Pegar a data e tipo de refeição do registro que disparou o trigger
  if TG_OP = 'DELETE' then
    v_date := OLD.date;
    v_meal_type := OLD.meal_type;
  else
    v_date := NEW.date;
    v_meal_type := NEW.meal_type;
  end if;

  -- Atualizar apenas a view para a data e tipo de refeição específicos
  refresh materialized view concurrently public.meal_confirmation_counts;
  
  -- Registrar o refresh no log
  raise log 'Refreshing meal_confirmation_counts for date: % and meal_type: %', v_date, v_meal_type;
  
  return null;
end;
$$ language plpgsql security definer;

-- Criar trigger para atualizar a view quando a tabela meal_confirmations for modificada
drop trigger if exists refresh_meal_confirmation_counts_trigger on public.meal_confirmations;
create trigger refresh_meal_confirmation_counts_trigger
  after insert or update or delete on public.meal_confirmations
  for each row
  execute function public.refresh_meal_confirmation_counts();

-- Garantir permissões corretas para a view
alter materialized view public.meal_confirmation_counts owner to postgres;

grant select on public.meal_confirmation_counts to authenticated;
grant select on public.meal_confirmation_counts to service_role;
grant select on public.meal_confirmation_counts to anon;

-- Garantir permissões corretas para a tabela meal_confirmations
grant all on public.meal_confirmations to authenticated;
grant all on public.meal_confirmations to service_role;
grant all on public.meal_confirmations to anon;

-- Garantir permissões para a função de refresh
grant execute on function public.refresh_meal_confirmation_counts to authenticated;
grant execute on function public.refresh_meal_confirmation_counts to service_role;
grant execute on function public.refresh_meal_confirmation_counts to anon; 