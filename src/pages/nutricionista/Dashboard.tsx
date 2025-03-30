import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Utensils, PieChart, Edit, MessageSquare, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationButton from '@/components/ui/NotificationButton';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';
import { useNotifications } from '../../contexts/NotificationContext';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
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
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StatusBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3 overflow-hidden">
            {profile?.profile_image ? (
              <img 
                src={profile.profile_image} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Error loading profile image:', e);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '';
                }}
              />
            ) : (
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
            )}
          </div>
          <h1 className="text-xl font-medium text-[#f45b43]">
            Olá, {profile?.name ? profile.name.split(' ')[0] : 'Nutricionista'}!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="ml-4">
            <NotificationButton />
          </div>
          <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
            <Settings size={24} />
          </Link>
        </div>
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
        </div>
        
        <div className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.id} className="card-primary shadow-lg bg-white border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-[#244b2c]">{meal.type}</h3>
                <span className="text-xs text-gray-600">{meal.time}</span>
              </div>
              
              <p className="text-gray-800 mb-3">{meal.menu}</p>
              
              <div className="flex items-center justify-between bg-[#fde2a1] p-2 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <PieChart size={16} className="text-[#f45b43] mr-1" />
                  <span className="text-xs text-[#f45b43] font-medium">Confirmados</span>
                </div>
                <span className="font-bold text-[#f45b43]">{meal.confirmedCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mx-6 mb-3">
        <Link 
          to="/nutricionista/menu" 
          className="btn-primary w-full flex items-center justify-center mb-3"
        >
          <Utensils size={18} className="mr-2" />
          <span>Gerenciar Cardápio Semanal</span>
        </Link>
        
        <Link 
          to="/nutricionista/feedback" 
          className="bg-[#f45b43] hover:bg-[#f45b43]/90 text-white w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all"
        >
          <MessageSquare size={18} className="mr-2" />
          <span>Ver Comentários e Sugestões</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
