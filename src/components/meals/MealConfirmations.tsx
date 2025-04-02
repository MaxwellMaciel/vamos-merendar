import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';

interface MealConfirmation {
  id: string;
  student_name: string;
  student_matricula: string;
  student_image?: string;
  created_at: string;
}

interface MealConfirmationsProps {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'snack';
}

const MealConfirmations: React.FC<MealConfirmationsProps> = ({ date, mealType }) => {
  const [confirmations, setConfirmations] = useState<MealConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfirmations();
  }, [date, mealType]);

  const fetchConfirmations = async () => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('meal_confirmations')
        .select('id, student_name, student_matricula, student_image, created_at')
        .eq('date', formattedDate)
        .eq('meal_type', mealType)
        .eq('status', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filtra apenas os campos necessários
      const filteredData = (data || []).map(item => ({
        id: item.id,
        student_name: item.student_name,
        student_matricula: item.student_matricula,
        student_image: item.student_image,
        created_at: item.created_at
      }));
      
      setConfirmations(filteredData);
    } catch (error) {
      console.error('Error fetching confirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealTitle = () => {
    switch (mealType) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche da Tarde';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmations.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <User className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <p>Nenhuma confirmação encontrada</p>
        </div>
      ) : (
        confirmations.map((confirmation) => (
          <div key={confirmation.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <Avatar className="w-10 h-10">
              {confirmation.student_image ? (
                <AvatarImage src={confirmation.student_image} alt={confirmation.student_name} />
              ) : (
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{confirmation.student_name}</p>
              <p className="text-sm text-gray-500">Matrícula: {confirmation.student_matricula}</p>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(confirmation.created_at), 'HH:mm', { locale: ptBR })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MealConfirmations; 