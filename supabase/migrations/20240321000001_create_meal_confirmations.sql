-- Criar tabela meal_confirmations se não existir
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