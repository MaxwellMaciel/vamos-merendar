-- Excluir tabela de notificações se existir
drop table if exists public.notifications;

-- Criar tabela de notificações
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null check (type in ('attendance', 'class', 'menu', 'register', 'complete', 'meal_attendance')),
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null,
  target_audience text[] default '{}'::text[],
  deleted_at timestamp with time zone
);

-- Criar políticas de segurança
alter table public.notifications enable row level security;

-- Política para usuários verem suas próprias notificações
create policy "Usuários podem ver suas próprias notificações"
  on public.notifications for select
  using (auth.uid() = user_id);

-- Política para nutricionistas criarem notificações
create policy "Nutricionistas podem criar notificações"
  on public.notifications for insert
  with check (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid()
      and user_type = 'nutricionista'
    )
  );

-- Política para usuários marcarem suas notificações como lidas
create policy "Usuários podem marcar suas notificações como lidas"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Política para usuários excluírem suas notificações
create policy "Usuários podem excluir suas notificações"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id); 