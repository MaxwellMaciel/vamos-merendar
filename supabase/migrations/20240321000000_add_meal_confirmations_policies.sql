-- Habilitar RLS na tabela meal_confirmations
alter table public.meal_confirmations enable row level security;

-- Remover políticas existentes se houver
drop policy if exists "Alunos podem ver suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Alunos podem inserir suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Alunos podem atualizar suas próprias confirmações" on public.meal_confirmations;
drop policy if exists "Nutricionistas podem ver todas as confirmações" on public.meal_confirmations;

-- Política para alunos verem suas próprias confirmações
create policy "Alunos podem ver suas próprias confirmações"
  on public.meal_confirmations for select
  using (auth.uid() = student_id);

-- Política para alunos inserirem suas próprias confirmações
create policy "Alunos podem inserir suas próprias confirmações"
  on public.meal_confirmations for insert
  with check (auth.uid() = student_id);

-- Política para alunos atualizarem suas próprias confirmações
create policy "Alunos podem atualizar suas próprias confirmações"
  on public.meal_confirmations for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Política para nutricionistas verem todas as confirmações
create policy "Nutricionistas podem ver todas as confirmações"
  on public.meal_confirmations for select
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid()
      and user_type = 'nutricionista'
    )
  ); 