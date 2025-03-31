import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationButton from '@/components/ui/NotificationButton';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AttendanceQuestion = () => {
  const [selected, setSelected] = useState<'sim' | 'nao' | null>(null);

  return (
    <div className="bg-[#244b2c] rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-3 text-center">
        Irá comparecer ao campus?
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setSelected('sim')}
          className={`py-2 rounded-lg transition ${
            selected === 'sim' 
              ? 'bg-[#f45b43] text-white hover:bg-[#f45b43]/90' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Sim
        </button>
        <button 
          onClick={() => setSelected('nao')}
          className={`py-2 rounded-lg transition ${
            selected === 'nao' 
              ? 'bg-[#f45b43] text-white hover:bg-[#f45b43]/90' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
};

const ClassScheduleCard = ({ selectedDate }: { selectedDate: Date }) => {
  // Demonstração de dias com aulas agendadas
  const scheduledDays = [4, 5, 6, 7, 8, 9, 10];
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  return (
    <div className="bg-[#244b2c] rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-2 text-center">
        Reposição / Anteposição
      </h3>
      <div className="flex overflow-x-auto py-2 space-x-2 justify-center">
        {scheduledDays.map(day => {
          const isSelected = day === selectedDay;
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#f45b43] text-white font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20'
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
  const { unreadCount } = useNotifications();
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.name) {
          setUserName(profile.name.split(' ')[0]);
        }
      }
    };
    
    fetchUserName();
  }, []);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex justify-between items-center px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 bg-[#244b2c] mr-3">
            <AvatarImage src={profile?.profile_image || ''} alt={profile?.name || 'Perfil'} />
            <AvatarFallback className="bg-[#244b2c] text-white">
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
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-medium text-[#f45b43]">
            Olá, {profile?.name ? profile.name.split(' ')[0] : 'Professor(a)'}!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="ml-4">
            <NotificationButton />
          </div>
          <Link to="/settings" className="text-[#244b2c] hover:text-[#244b2c]/90 transition-colors">
            <Settings size={24} />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Calendar size={20} className="text-[#fde2a1] mr-2" />
          <h2 className="text-[#244b2c] font-semibold text-black">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>
        
        <DaySelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 mt-6">
          <AttendanceQuestion />
          <ClassScheduleCard selectedDate={selectedDate} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#fde2a1]/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <Bell size={24} className="text-[#244b2c] mb-2" />
            <p className="text-sm text-center text-[#244b2c]">
              Amanhã você tem aula agendada!
            </p>
          </div>
          <div className="bg-[#f45b43]/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <Calendar size={24} className="text-[#f45b43] mb-2" />
            <p className="text-sm text-center text-[#f45b43] font-medium">
              Aulas agendadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
