import React, { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import { Calendar, Utensils, PieChart, Edit, MessageSquare, Settings, Bell, ClipboardList, Users, X, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationButton from '@/components/ui/NotificationButton';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { useNotifications } from '../../contexts/NotificationContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import MealConfirmations from '@/components/meals/MealConfirmations';
import Loading from '@/components/Loading';
import BottomSheet from '@/components/ui/BottomSheet';
import QRCodeScanner from '@/components/qrcode/QRCodeScanner';

type Profile = Database['public']['Tables']['profiles']['Row'];
type WeeklyMenu = Database['public']['Tables']['weekly_menu']['Row'];
type MealAttendance = Database['public']['Tables']['meal_attendance']['Row'];

interface MealItem {
  id: number;
  type: string;
  time: string;
  menu: string;
  confirmedCount: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayMenu, setTodayMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { unreadCount } = useNotifications();
  const [showConfirmationsList, setShowConfirmationsList] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'snack' | null>(null);
  const [showQRCodeSheet, setShowQRCodeSheet] = useState(false);

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
        setProfile(data as Profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    fetchTodayMenu();
  }, [selectedDate]);

  const fetchTodayMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_menu')
        .select('*')
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .single();

      if (error) {
        console.error('Erro ao buscar cardápio:', error);
        setTodayMenu(null);
        return;
      }

      setTodayMenu(data);
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o cardápio do dia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const [meals, setMeals] = useState<MealItem[]>([
    {
      id: 1,
      type: 'Café da Manhã',
      time: '05:00 - 07:30',
      menu: todayMenu?.breakfast || 'Cardápio indisponível',
      confirmedCount: 0,
    },
    {
      id: 2,
      type: 'Almoço',
      time: '07:30 - 09:40',
      menu: todayMenu?.lunch || 'Cardápio indisponível',
      confirmedCount: 0,
    },
    {
      id: 3,
      type: 'Lanche da Tarde',
      time: '12:20 - 14:00',
      menu: todayMenu?.snack || 'Cardápio indisponível',
      confirmedCount: 0,
    },
  ]);

  useEffect(() => {
    const fetchConfirmationCounts = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        // Buscar confirmações diretamente da tabela meal_confirmations
        const { data: attendanceData, error } = await supabase
          .from('meal_confirmations')
          .select('meal_type')
          .eq('date', formattedDate)
          .eq('status', true);

        if (error) throw error;

        if (attendanceData) {
          // Contar confirmações por tipo de refeição
          const counts = {
            breakfast: attendanceData.filter(d => d.meal_type === 'breakfast').length,
            lunch: attendanceData.filter(d => d.meal_type === 'lunch').length,
            snack: attendanceData.filter(d => d.meal_type === 'snack').length
          };

          setMeals(prev => prev.map(meal => {
            const mealType = meal.type === 'Café da Manhã' ? 'breakfast' :
                           meal.type === 'Almoço' ? 'lunch' : 'snack';
            return {
              ...meal,
              confirmedCount: counts[mealType] || 0
            };
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
      }
    };

    fetchConfirmationCounts();

    // Inscrever para atualizações em tempo real
    const subscription = supabase
      .channel('meal_confirmations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_confirmations',
        filter: `date=eq.${format(selectedDate, 'yyyy-MM-dd')}`
      }, () => {
        fetchConfirmationCounts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  useEffect(() => {
    setMeals(prev => prev.map(meal => ({
      ...meal,
      menu: todayMenu ? 
        (meal.type === 'Café da Manhã' ? todayMenu.breakfast :
         meal.type === 'Almoço' ? todayMenu.lunch :
         todayMenu.snack) : 
        'Cardápio indisponível'
    })));
  }, [todayMenu]);

  useEffect(() => {
    console.log('Dashboard - Estado do BottomSheet:', { showConfirmationsList, selectedMealType });
  }, [showConfirmationsList, selectedMealType]);

  const handleQRCodeScan = (decodedText: string) => {
    console.log('QR Code lido:', decodedText);
    // Aqui você pode implementar a lógica para processar o QR code lido
  };

  const handleQRCodeError = (error: string) => {
    console.error('Erro ao ler QR Code:', error);
  };

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
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
          <h1 className="text-lg font-medium text-[#f45b43]">
            Olá, {profile?.name ? profile.name.split(' ')[0] : 'Nutricionista'}!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="ml-4">
            <NotificationButton />
          </div>
          <button 
            type="button" 
            className="text-[#244b2c] hover:text-[#244b2c]/90 transition-colors"
            onClick={() => setShowQRCodeSheet(true)}
          >
            <QrCode size={24} />
          </button>
          <Link 
            to="/nutricionista/attendance" 
            className="text-[#244b2c] hover:text-[#244b2c]/90 transition-colors"
          >
            <ClipboardList size={24} />
          </Link>
          <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
            <Settings size={24} />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Calendar size={20} className="text-primary mr-2" />
          <h2 className="text-base font-medium text-black">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>
        
        <DaySelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
      </div>
      
      <div className="mx-6 mb-6">
        <div className="bg-[#244b2c] rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <Utensils size={20} className="text-white mr-2" />
            <h2 className="text-base font-medium text-white">
              Cardápio do Dia
            </h2>
          </div>
          
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="bg-white/10 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">{meal.type}</h3>
                  <span className="text-xs text-white">{meal.time}</span>
                </div>
                
                <p className="text-sm text-white mb-3">{meal.menu}</p>
                
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center justify-between bg-white/20 p-2 rounded-lg shadow-sm flex-1">
                    <div className="flex items-center">
                      <PieChart size={16} className="text-white mr-1" />
                      <span className="text-sm text-white font-medium">Confirmados</span>
                    </div>
                    <span className="text-sm font-bold text-white">{meal.confirmedCount}</span>
                  </div>

                  <button 
                    onClick={() => {
                      const mealType = meal.type === 'Café da Manhã' ? 'breakfast' :
                                     meal.type === 'Almoço' ? 'lunch' : 'snack';
                      setSelectedMealType(mealType);
                      setShowConfirmationsList(true);
                    }}
                    className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Users size={16} className="mr-1" />
                    <span className="text-xs font-medium">Ver lista</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mx-6 mb-3">
        <Link 
          to="/nutricionista/menu" 
          className="btn-primary w-full flex items-center justify-center mb-3"
        >
          <Utensils size={18} className="mr-2" />
          <span className="text-sm">Gerenciar Cardápio Semanal</span>
        </Link>
        
        <Link 
          to="/nutricionista/feedback" 
          className="bg-[#f45b43] hover:bg-[#f45b43]/90 text-white w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all mb-3"
        >
          <MessageSquare size={18} className="mr-2" />
          <span className="text-sm">Ver Comentários e Sugestões</span>
        </Link>
      </div>

      {/* Modal de Confirmações */}
      {showConfirmationsList && selectedMealType && (
        <BottomSheet
          open={showConfirmationsList}
          onOpenChange={setShowConfirmationsList}
          title={`Confirmações para ${selectedMealType === 'breakfast' ? 'Café da Manhã' : selectedMealType === 'lunch' ? 'Almoço' : 'Lanche'}`}
        >
          <MealConfirmations
            date={selectedDate.toISOString().split('T')[0]}
            mealType={selectedMealType}
          />
        </BottomSheet>
      )}

      {/* BottomSheet do QR Code */}
      <BottomSheet
        open={showQRCodeSheet}
        onOpenChange={setShowQRCodeSheet}
        title="Leitor de QR Code"
      >
        <div className="p-6">
          <QRCodeScanner
            onScanSuccess={handleQRCodeScan}
            onScanError={handleQRCodeError}
          />
        </div>
      </BottomSheet>
    </div>
  );
};

export default Dashboard;
