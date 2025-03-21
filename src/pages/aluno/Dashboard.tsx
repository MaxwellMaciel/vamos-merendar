
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import MealCard from '../../components/meals/MealCard';
import { Calendar, Utensils, QrCode, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealAttendance, setMealAttendance] = useState({
    breakfast: null as boolean | null,
    lunch: null as boolean | null,
    snack: null as boolean | null,
  });
  const [remainingMeals, setRemainingMeals] = useState(5);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Reset attendance when date changes
    setMealAttendance({
      breakfast: null,
      lunch: null,
      snack: null,
    });
  };

  const handleAttendance = (meal: 'breakfast' | 'lunch' | 'snack', attend: boolean) => {
    setMealAttendance(prev => ({
      ...prev,
      [meal]: attend,
    }));
    
    if (attend) {
      toast({
        title: "Presença confirmada",
        description: `Sua presença foi confirmada para ${getMealName(meal)}.`,
      });
      setRemainingMeals(prev => Math.max(0, prev - 1));
    } else {
      toast({
        title: "Ausência registrada",
        description: `Sua ausência foi registrada para ${getMealName(meal)}.`,
      });
    }
  };

  const getMealName = (meal: 'breakfast' | 'lunch' | 'snack') => {
    switch (meal) {
      case 'breakfast': return "o café da manhã";
      case 'lunch': return "o almoço";
      case 'snack': return "o lanche da tarde";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-secondary">Olá, Aluno(a)!</h1>
        </div>
        
        <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
          <Settings size={24} />
        </Link>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Calendar size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-700">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>
        
        <DaySelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
      </div>
      
      <div className="mx-6 mb-6 card-secondary">
        <h2 className="text-lg font-medium text-white mb-4">
          Confirme sua presença para as refeições:
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="text-white font-medium mb-2">Café da Manhã</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAttendance('breakfast', true)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.breakfast === true
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Sim
              </button>
              
              <button
                onClick={() => handleAttendance('breakfast', false)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.breakfast === false
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Não
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="text-white font-medium mb-2">Almoço</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAttendance('lunch', true)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.lunch === true
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Sim
              </button>
              
              <button
                onClick={() => handleAttendance('lunch', false)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.lunch === false
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Não
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="text-white font-medium mb-2">Lanche da Tarde</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAttendance('snack', true)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.snack === true
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Sim
              </button>
              
              <button
                onClick={() => handleAttendance('snack', false)}
                className={`py-2 rounded-md font-medium transition-all ${
                  mealAttendance.snack === false
                    ? 'bg-accent text-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex mx-6 gap-4 mb-6">
        <div className="flex-1 bg-primary rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Utensils size={20} className="text-white mr-2" />
            <h2 className="text-lg font-medium text-white">Refeições do dia</h2>
          </div>
          
          <MealCard
            title="Lanche (MANHÃ)"
            description="Pão, manteiga, café com leite"
            type="breakfast"
          />
          
          <MealCard
            title="Almoço"
            description="Arroz, feijão, carne, salada"
            type="lunch"
          />
          
          <MealCard
            title="Lanche (TARDE)"
            description="Suco de laranja, bolo de chocolate"
            type="dinner"
          />
        </div>
        
        <div className="flex flex-col gap-4 w-1/3">
          <div className="bg-secondary rounded-xl p-4 text-white text-center flex flex-col items-center justify-center">
            <div className="font-bold text-2xl mb-1">
              {remainingMeals}
            </div>
            <div className="text-sm">
              Restam<br />Refeições
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center">
            <QrCode size={48} className="text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
