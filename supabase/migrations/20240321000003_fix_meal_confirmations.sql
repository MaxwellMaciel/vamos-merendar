-- Garantir que a tabela meal_confirmations existe e está configurada corretamente
create table if not exists public.meal_confirmations (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'snack')),
  student_id uuid references auth.users(id) on delete cascade not null,
  student_name text not null,
  student_matricula text not null,
  student_image text,
  status boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint meal_confirmations_date_meal_type_student_id_key unique (date, meal_type, student_id)
);

-- Criar índices para melhor performance
create index if not exists meal_confirmations_date_idx on public.meal_confirmations(date);
create index if not exists meal_confirmations_student_id_idx on public.meal_confirmations(student_id);
create index if not exists meal_confirmations_meal_type_idx on public.meal_confirmations(meal_type);

-- Habilitar RLS
alter table public.meal_confirmations enable row level security;

-- Remover políticas existentes
drop policy if exists "Alunos podem ver suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Alunos podem inserir suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Alunos podem atualizar suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Nutricionistas podem ver todas as confirmações" on public.meal_confirmations;

-- Criar novas políticas
create policy "Alunos podem ver suas próprias confirmações"
  on public.meal_confirmations for select
  using (auth.uid() = student_id);

create policy "Alunos podem inserir suas próprias confirmações"
  on public.meal_confirmations for insert
  with check (auth.uid() = student_id);

create policy "Alunos podem atualizar suas próprias confirmações"
  on public.meal_confirmations for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Nutricionistas podem ver todas as confirmações"
  on public.meal_confirmations for select
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid()
      and user_type = 'nutricionista'
    )
  );

-- Garantir permissões
grant all on public.meal_confirmations to authenticated;
grant all on public.meal_confirmations to service_role;
grant all on public.meal_confirmations to anon;

-- Garantir permissões de sequência
grant usage, select on all sequences in schema public to authenticated;
grant usage, select on all sequences in schema public to service_role;
grant usage, select on all sequences in schema public to anon; 