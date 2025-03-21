
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Users, ChevronRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const MealReportItem = ({ title, count }: { title: string; count: number }) => (
  <div className="flex justify-between items-center border-b border-primary-light p-3">
    <span className="font-medium">{title}</span>
    <div className="flex items-center">
      <span className="text-lg font-bold mr-2">{count}</span>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({
    total: 120,
    confirmed: 87,
    declined: 12,
    pending: 21,
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    // Simulando diferentes dados para diferentes dias
    const day = date.getDate();
    setAttendanceData({
      total: 120,
      confirmed: 70 + (day % 20),
      declined: 10 + (day % 10),
      pending: 40 - (day % 15),
    });
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
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-secondary">Olá, Professor(a)!</h1>
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
      
      <div className="mx-6 mb-6 card-primary">
        <div className="flex items-center mb-4">
          <Users size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-800">
            Relatório de Presença
          </h2>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-800">{attendanceData.total}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Confirmados</div>
              <div className="text-2xl font-bold text-green-600">{attendanceData.confirmed}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Pendentes</div>
              <div className="text-2xl font-bold text-amber-500">{attendanceData.pending}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary rounded-lg overflow-hidden text-white">
          <h3 className="bg-primary-dark p-3 font-medium">Refeições Confirmadas</h3>
          <MealReportItem title="Café da Manhã" count={35} />
          <MealReportItem title="Almoço" count={68} />
          <MealReportItem title="Lanche da Tarde" count={42} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
