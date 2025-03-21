
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Coffee, UtensilsCrossed, Soup, Save } from 'lucide-react';

const WeeklyMenu = () => {
  const { toast } = useToast();
  const [startDate] = useState(new Date());
  
  // Initialize a week of menus
  const initialWeekMenus = Array.from({ length: 5 }).map((_, index) => {
    const day = addDays(startDate, index);
    return {
      date: day,
      breakfast: '',
      lunch: '',
      snack: '',
    };
  });
  
  const [weekMenus, setWeekMenus] = useState(initialWeekMenus);
  
  const handleMenuChange = (index: number, meal: 'breakfast' | 'lunch' | 'snack', value: string) => {
    const newWeekMenus = [...weekMenus];
    newWeekMenus[index] = {
      ...newWeekMenus[index],
      [meal]: value,
    };
    setWeekMenus(newWeekMenus);
  };
  
  const handleSaveMenu = () => {
    toast({
      title: "Cardápio salvo",
      description: "O cardápio semanal foi atualizado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/nutricionista/dashboard" label="Gerenciar Cardápio Semanal" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <CalendarDays size={24} className="text-primary mr-2" />
          <h1 className="text-xl font-medium text-primary">Cardápio Semanal</h1>
        </div>
        
        <div className="space-y-8">
          {weekMenus.map((dayMenu, index) => (
            <div key={index} className="card-primary animate-in fade-in">
              <h2 className="text-lg font-medium text-primary mb-3">
                {format(dayMenu.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Coffee size={18} className="text-secondary mr-2" />
                    <h3 className="font-medium text-gray-800">Café da Manhã</h3>
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                    rows={2}
                    placeholder="Descreva o cardápio do café da manhã..."
                    value={dayMenu.breakfast}
                    onChange={(e) => handleMenuChange(index, 'breakfast', e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <UtensilsCrossed size={18} className="text-secondary mr-2" />
                    <h3 className="font-medium text-gray-800">Almoço</h3>
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                    rows={2}
                    placeholder="Descreva o cardápio do almoço..."
                    value={dayMenu.lunch}
                    onChange={(e) => handleMenuChange(index, 'lunch', e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Soup size={18} className="text-secondary mr-2" />
                    <h3 className="font-medium text-gray-800">Lanche da Tarde</h3>
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                    rows={2}
                    placeholder="Descreva o cardápio do lanche da tarde..."
                    value={dayMenu.snack}
                    onChange={(e) => handleMenuChange(index, 'snack', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <button 
            className="btn-primary w-full flex items-center justify-center"
            onClick={handleSaveMenu}
          >
            <Save size={18} className="mr-2" />
            <span>Salvar Cardápio Semanal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMenu;
