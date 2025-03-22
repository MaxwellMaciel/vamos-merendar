
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const AttendanceQuestion = () => {
  return (
    <div className="bg-primary rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-3 text-center">
        Irá comparecer ao campus?
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark/90 transition">
          Sim
        </button>
        <button className="bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition">
          Não
        </button>
      </div>
    </div>
  );
};

const ClassScheduleCard = ({ selectedDate }: { selectedDate: Date }) => {
  // Demonstração de dias com aulas agendadas
  const scheduledDays = [4, 5, 6, 7, 8, 9, 10];
  
  return (
    <div className="bg-secondary rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-2 text-center">
        Reposição / Anteposição
      </h3>
      <div className="flex overflow-x-auto py-2 space-x-2 justify-center">
        {scheduledDays.map(day => {
          const isSelected = day === selectedDate.getDate();
          return (
            <div
              key={day}
              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                isSelected
                  ? 'bg-accent text-secondary font-bold'
                  : 'bg-white/10 text-white'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toggleNotifications, unreadCount } = useNotifications();
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
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
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-primary">
            Olá, Professor(a)!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="text-primary hover:text-primary-dark transition-colors"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
            <Settings size={24} />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar size={20} className="text-accent mr-2" />
            <h2 className="text-amber-500 font-semibold">
              {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
          </div>
          <button className="bg-accent/20 p-2 rounded-lg">
            <Calendar size={20} className="text-accent" />
          </button>
        </div>
        
        <DaySelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
        
        <AttendanceQuestion />
        
        <ClassScheduleCard selectedDate={selectedDate} />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-100 rounded-lg p-4 flex flex-col items-center justify-center">
            <Bell size={24} className="text-amber-500 mb-2" />
            <p className="text-sm text-center text-amber-800">
              Amanhã você tem aula agendada!
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <Calendar size={24} className="text-primary mb-2" />
            <p className="text-sm text-center text-primary-dark font-medium">
              Aulas agendadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
