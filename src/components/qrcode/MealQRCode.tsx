import React from 'react';
import QRCode from 'react-qr-code';
import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { useMealQR } from '@/hooks/use-meal-qr';
import Loading from '@/components/Loading';
import BottomSheet from '@/components/ui/BottomSheet';

interface MealQRCodeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack';
  attendanceId: string;
}

const MealQRCode: React.FC<MealQRCodeProps> = ({ 
  open, 
  onOpenChange,
  studentId,
  date,
  mealType,
  attendanceId
}) => {
  const { qrCodeHash, loading } = useMealQR({
    studentId,
    date,
    mealType
  });

  const getMealIcon = () => {
    switch(mealType) {
      case 'breakfast': return <Coffee size={24} className="text-primary mb-2" />;
      case 'lunch': return <UtensilsCrossed size={24} className="text-primary mb-2" />;
      case 'snack': return <Cookie size={24} className="text-primary mb-2" />;
    }
  };

  const getMealTitle = () => {
    switch(mealType) {
      case 'breakfast': return "Café da Manhã";
      case 'lunch': return "Almoço";
      case 'snack': return "Lanche da Tarde";
    }
  };

  // Gera o valor do QR code usando o hash persistente
  const qrValue = qrCodeHash ? JSON.stringify({
    hash: qrCodeHash,
    studentId,
    date,
    mealType,
    attendanceId
  }) : '';

  if (loading) {
    return <Loading message="Gerando QR Code..." />;
  }

  return (
    <BottomSheet 
      open={open} 
      onOpenChange={onOpenChange}
      title={`QR Code - ${getMealTitle()}`}
    >
      <div className="flex flex-col items-center p-6">
        {getMealIcon()}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <QRCode
            value={qrValue}
            size={200}
            level="H"
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Apresente este QR code para confirmar sua presença na refeição
        </p>
      </div>
    </BottomSheet>
  );
};

export default MealQRCode;
