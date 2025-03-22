import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from 'react-qr-code';
import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';

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
  const generateQRValue = () => {
    const qrData = {
      studentId,
      date,
      mealType,
      attendanceId,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(qrData);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary flex items-center justify-center flex-col">
            {getMealIcon()}
            QR Code - {getMealTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center py-6">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <QRCode
              value={generateQRValue()}
              size={200}
              level="H"
            />
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Apresente este QR code para confirmar sua presença na refeição
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default MealQRCode;
