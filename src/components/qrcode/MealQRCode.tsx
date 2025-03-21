
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
  attendance: {
    breakfast: boolean | null;
    lunch: boolean | null;
    snack: boolean | null;
  };
}

const MealQRCode: React.FC<MealQRCodeProps> = ({ 
  open, 
  onOpenChange,
  studentId,
  date,
  attendance
}) => {
  const generateQRValue = (mealType: string) => {
    // Create a structured data object for the QR code
    const qrData = {
      studentId,
      date,
      mealType,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(qrData);
  };

  // Determinar a aba inicial baseada na presença confirmada
  const getDefaultTab = () => {
    if (attendance.lunch === true) return 'lunch';
    if (attendance.breakfast === true) return 'breakfast';
    if (attendance.snack === true) return 'snack';
    return 'breakfast'; // Fallback
  };

  const defaultTab = getDefaultTab();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">QR Code da Refeição</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="breakfast" 
              className="flex items-center gap-2"
              disabled={attendance.breakfast !== true}
            >
              <Coffee size={16} />
              <span>Café</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lunch" 
              className="flex items-center gap-2"
              disabled={attendance.lunch !== true}
            >
              <UtensilsCrossed size={16} />
              <span>Almoço</span>
            </TabsTrigger>
            <TabsTrigger 
              value="snack" 
              className="flex items-center gap-2"
              disabled={attendance.snack !== true}
            >
              <Cookie size={16} />
              <span>Lanche</span>
            </TabsTrigger>
          </TabsList>
          
          {["breakfast", "lunch", "snack"].map((meal) => {
            const isConfirmed = attendance[meal as keyof typeof attendance] === true;
            
            return (
              <TabsContent key={meal} value={meal} className="flex justify-center py-6">
                {isConfirmed ? (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <QRCode
                      value={generateQRValue(meal)}
                      size={200}
                      level="H"
                    />
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center w-full">
                    <p className="text-amber-600">Você precisa confirmar presença para gerar o QR code.</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Apresente este QR code para confirmar sua presença na refeição
          </p>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MealQRCode;
