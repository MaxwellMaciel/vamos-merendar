
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Utensils, PieChart, Edit, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([
    {
      id: 1,
      type: 'Café da Manhã',
      time: '07:30 - 08:30',
      menu: 'Pão, manteiga, café com leite',
      confirmedCount: 35,
    },
    {
      id: 2,
      type: 'Almoço',
      time: '11:30 - 13:00',
      menu: 'Arroz, feijão, carne, salada',
      confirmedCount: 68,
    },
    {
      id: 3,
      type: 'Lanche da Tarde',
      time: '15:30 - 16:30',
      menu: 'Suco de laranja, bolo de chocolate',
      confirmedCount: 42,
    },
  ]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    // Simulando diferentes dados para diferentes dias
    const day = date.getDate();
    const newMeals = [...meals];
    newMeals[0].confirmedCount = 30 + (day % 10);
    newMeals[1].confirmedCount = 60 + (day % 15);
    newMeals[2].confirmedCount = 40 + (day % 8);
    setMeals(newMeals);
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
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-secondary">Olá, Nutricionista!</h1>
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
      
      <div className="mx-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Utensils size={20} className="text-primary mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Cardápio do Dia
            </h2>
          </div>
          
          <Link to="/nutricionista/menu/edit-day" className="text-primary hover:text-primary-dark transition-colors">
            <Edit size={20} />
          </Link>
        </div>
        
        <div className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.id} className="card-primary">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-primary">{meal.type}</h3>
                <span className="text-xs text-gray-500">{meal.time}</span>
              </div>
              
              <p className="text-gray-700 mb-3">{meal.menu}</p>
              
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  <PieChart size={16} className="text-secondary mr-1" />
                  <span className="text-xs text-gray-600">Confirmados</span>
                </div>
                <span className="font-bold text-secondary">{meal.confirmedCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mx-6 mb-6">
        <Link 
          to="/nutricionista/menu" 
          className="btn-primary w-full flex items-center justify-center"
        >
          <Utensils size={18} className="mr-2" />
          <span>Gerenciar Cardápio Semanal</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
