import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

type MealType = 'breakfast' | 'lunch' | 'snack';

interface UseMealQRProps {
  studentId: string;
  date: string;
  mealType: MealType;
}

export function useMealQR({ studentId, date, mealType }: UseMealQRProps) {
  const [qrCodeHash, setQrCodeHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQRCode();
  }, [studentId, date, mealType]);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      console.log('Buscando QR code para:', { studentId, date, mealType });

      const { data, error } = await supabase
        .rpc('get_or_create_qr_code', {
          p_student_id: studentId,
          p_date: date,
          p_meal_type: mealType
        });

      if (error) {
        console.error('Erro ao buscar/criar QR code:', error);
        throw error;
      }

      console.log('QR code obtido:', data);
      setQrCodeHash(data);
    } catch (error) {
      console.error('Erro ao gerenciar QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    qrCodeHash,
    loading
  };
}

// Função para gerar um hash único
function generateUniqueHash(studentId: string, date: string, mealType: string): string {
  const uniqueString = `${studentId}-${date}-${mealType}`;
  let hash = 0;
  
  for (let i = 0; i < uniqueString.length; i++) {
    const char = uniqueString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Converter para string hexadecimal positiva de 8 caracteres
  return Math.abs(hash).toString(16).padStart(8, '0');
} 