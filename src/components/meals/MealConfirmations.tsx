import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users } from 'lucide-react';
import Loading from '@/components/Loading';

interface MealConfirmation {
  student_name: string;
  student_matricula: string;
  student_image: string;
  confirmed_at: string;
  status: boolean;
}

interface MealCounts {
  confirmed_count: number;
  declined_count: number;
}

interface MealConfirmationsProps {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'snack';
}

const MealConfirmations: React.FC<MealConfirmationsProps> = ({ date, mealType }) => {
  const [confirmations, setConfirmations] = useState<MealConfirmation[]>([]);
  const [counts, setCounts] = useState<MealCounts>({ confirmed_count: 0, declined_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Buscar contagens
        const { data: countsData, error: countsError } = await supabase
          .from('meal_confirmation_counts')
          .select('*')
          .eq('date', formattedDate)
          .eq('meal_type', mealType)
          .single();

        if (countsError) throw countsError;
        
        if (countsData) {
          setCounts({
            confirmed_count: countsData.confirmed_count,
            declined_count: countsData.declined_count
          });
        }

        // Buscar confirmações
        const { data, error } = await supabase
          .from('meal_confirmations')
          .select('*')
          .eq('date', formattedDate)
          .eq('meal_type', mealType)
          .eq('status', true)
          .order('confirmed_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setConfirmations(data);
        }
      } catch (error) {
        console.error('Erro ao buscar confirmações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmations();

    // Inscrever para atualizações em tempo real
    const subscription = supabase
      .channel('meal_confirmations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_confirmations',
        filter: `date=eq.${format(date, 'yyyy-MM-dd')},meal_type=eq.${mealType}`
      }, (payload) => {
        // Atualizar os dados quando houver mudanças
        fetchConfirmations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [date, mealType]);

  if (loading) {
    return <Loading message="Carregando confirmações..." />;
  }

  const getMealName = () => {
    switch (mealType) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche da Tarde';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Confirmações para {getMealName()}
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-green-600 font-medium">{counts.confirmed_count}</span> confirmados
          </div>
          <div className="text-sm">
            <span className="text-red-600 font-medium">{counts.declined_count}</span> ausentes
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {confirmations.length > 0 ? (
          confirmations.map((confirmation) => (
            <div key={confirmation.student_matricula} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={confirmation.student_image} alt={confirmation.student_name} />
                  <AvatarFallback>
                    {confirmation.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{confirmation.student_name}</p>
                  <p className="text-xs text-gray-500">Matrícula: {confirmation.student_matricula}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {format(new Date(confirmation.confirmed_at), "HH:mm", { locale: ptBR })}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <Users size={32} className="mb-2" />
            <p>Nenhuma confirmação ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealConfirmations; 