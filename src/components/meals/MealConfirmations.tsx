import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Loader2, CheckCircle2 } from 'lucide-react';
import type { Database } from '@/types/supabase';

type MealConfirmation = Database['public']['Tables']['meal_confirmations']['Row'];

interface MealConfirmationsProps {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack';
}

export function MealConfirmations({ date, mealType }: MealConfirmationsProps) {
  const [confirmations, setConfirmations] = useState<MealConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfirmations() {
      console.log('Iniciando busca de confirmações:', { date, mealType });
      
      try {
        const { data, error } = await supabase
          .from('meal_confirmations')
          .select('*')
          .eq('date', date)
          .eq('meal_type', mealType)
          .eq('status', true);

        if (error) {
          console.error('Erro ao buscar confirmações:', error);
          setConfirmations([]);
          return;
        }

        console.log('Dados recebidos:', data);
        setConfirmations(data || []);
      } catch (error) {
        console.error('Erro ao buscar confirmações:', error);
        setConfirmations([]);
      } finally {
        setLoading(false);
        console.log('Estado final:', { loading: false, confirmationsCount: confirmations.length });
      }
    }

    fetchConfirmations();
  }, [date, mealType]);

  const getMealTitle = () => {
    switch (mealType) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche da Tarde';
      default: return '';
    }
  };

  if (loading) {
    console.log('Renderizando estado de carregamento');
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  console.log('Renderizando lista de confirmações:', { count: confirmations.length });

  if (confirmations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nenhuma confirmação encontrada para esta refeição.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {confirmations.map((confirmation) => (
        <div
          key={confirmation.id}
          className="flex items-start gap-4 rounded-lg border p-4"
        >
          <Avatar className="h-10 w-10">
            {confirmation.student_image ? (
              <AvatarImage src={confirmation.student_image} alt={confirmation.student_name} />
            ) : (
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{confirmation.student_name}</p>
              <span className="text-sm text-muted-foreground">
                Matrícula: {confirmation.student_matricula}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Confirmou presença</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MealConfirmations; 