
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
}

const MealQRCode: React.FC<MealQRCodeProps> = ({ 
  open, 
  onOpenChange,
  studentId,
  date
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code da Refeição</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="breakfast">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakfast" className="flex items-center gap-2">
              <Coffee size={16} />
              <span>Café</span>
            </TabsTrigger>
            <TabsTrigger value="lunch" className="flex items-center gap-2">
              <UtensilsCrossed size={16} />
              <span>Almoço</span>
            </TabsTrigger>
            <TabsTrigger value="snack" className="flex items-center gap-2">
              <Cookie size={16} />
              <span>Lanche</span>
            </TabsTrigger>
          </TabsList>
          
          {["breakfast", "lunch", "snack"].map((meal) => (
            <TabsContent key={meal} value={meal} className="flex justify-center py-6">
              <div className="bg-white p-3 rounded-lg">
                <QRCode
                  value={generateQRValue(meal)}
                  size={200}
                  level="H"
                />
              </div>
            </TabsContent>
          ))}
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Apresente este QR code para confirmar sua presença na refeição
          </p>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MealQRCode;
