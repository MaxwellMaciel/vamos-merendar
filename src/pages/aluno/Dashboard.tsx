import React, { useState, useEffect } from 'react';
import { format, isSameDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import MealCard from '../../components/meals/MealCard';
import { Calendar, Utensils, QrCode, MessageSquare, Settings, Bell, CalendarDays, Coffee, UtensilsCrossed, Soup } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import MealQRCode from '@/components/qrcode/MealQRCode';
import { useProfile } from '@/hooks/use-profile';
import NotificationButton from '@/components/ui/NotificationButton';
import { useNotifications } from '../../contexts/NotificationContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Database } from '@/types/supabase';
import Loading from '@/components/Loading';

type WeeklyMenu = Database['public']['Tables']['weekly_menu']['Row'];

interface MenuData {
  breakfast: string;
  lunch: string;
  snack: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useProfile();
  const { addNotification, unreadCount } = useNotifications();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealAttendance, setMealAttendance] = useState({
    id: '',
    breakfast: null as boolean | null,
    lunch: null as boolean | null,
    snack: null as boolean | null,
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'snack' | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [hasConfirmedMeal, setHasConfirmedMeal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentDay, setIsCurrentDay] = useState(true);
  const [menuData, setMenuData] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);

  // Definir limites de horário para cada refeição
  const mealLimits = {
    breakfast: { start: 5, end: 7.5 }, // 5:00 - 7:30
    lunch: { start: 7.5, end: 9.67 }, // 7:30 - 9:40
    snack: { start: 12.33, end: 14 }, // 12:20 - 14:00
  };

  // Calcular o horário atual
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + (currentMinute / 60);

  useEffect(() => {
    setIsCurrentDay(isSameDay(selectedDate, new Date()));
  }, [selectedDate]);

  useEffect(() => {
    if (profile?.user_id) {
      fetchAttendance(profile.user_id, selectedDate);
    }
  }, [profile, selectedDate]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('weekly_menu')
          .select('*')
          .eq('date', formattedDate)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setMenuData(data);
        } else {
          setMenuData(null);
        }
      } catch (error) {
        console.error('Erro ao buscar cardápio:', error);
        setMenuData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [selectedDate]);

  const fetchAttendance = async (userId: string, date: Date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('meal_attendance')
        .select('*')
        .eq('student_id', userId)
        .eq('date', formattedDate)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setMealAttendance({
          id: data.id,
          breakfast: data.breakfast,
          lunch: data.lunch,
          snack: data.snack,
        });
        
        setHasConfirmedMeal(data.breakfast === true || data.lunch === true || data.snack === true);
      } else {
        setMealAttendance({
          id: '',
          breakfast: null,
          lunch: null,
          snack: null,
        });
        setHasConfirmedMeal(false);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (profile?.user_id) {
      fetchAttendance(profile.user_id, date);
    } else {
      setMealAttendance({
        id: '',
        breakfast: null,
        lunch: null,
        snack: null,
      });
      setHasConfirmedMeal(false);
    }
  };

  const handleAttendance = async (meal: 'breakfast' | 'lunch' | 'snack', attend: boolean) => {
    if (!profile?.user_id || !isCurrentDay) {
      console.log('Retornando: profile?.user_id ou !isCurrentDay é falso', { 
        profile: profile?.user_id, 
        isCurrentDay,
        profileData: profile 
      });
      return;
    }

    // Verificar se está dentro do horário permitido
    const mealLimit = mealLimits[meal];
    if (currentTime > mealLimit.end) {
      toast({
        title: "Horário expirado",
        description: "O horário para confirmar esta refeição já passou.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      console.log('Iniciando atualização de presença:', {
        meal,
        attend,
        formattedDate,
        profile: {
          user_id: profile.user_id,
          name: profile.name,
          matricula: profile.matricula,
          profile_image: profile.profile_image
        }
      });
      
      const newAttendance = {
        ...mealAttendance,
        [meal]: attend,
      };
      
      setMealAttendance(newAttendance);
      
      // Salvar na tabela meal_attendance
      const { data, error: fetchError } = await supabase
        .from('meal_attendance')
        .select('*')
        .eq('student_id', profile.user_id)
        .eq('date', formattedDate)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Erro ao buscar attendance:', fetchError);
        throw fetchError;
      }
      
      if (data) {
        console.log('Atualizando attendance existente:', data.id);
        const { error } = await supabase
          .from('meal_attendance')
          .update({
            [meal]: attend,
          })
          .eq('id', data.id);
        
        if (error) {
          console.error('Erro ao atualizar attendance:', error);
          throw error;
        }
        
        setMealAttendance(prev => ({
          ...prev,
          id: data.id
        }));
      } else {
        console.log('Criando novo attendance');
        const { data: newData, error } = await supabase
          .from('meal_attendance')
          .insert({
            student_id: profile.user_id,
            date: formattedDate,
            [meal]: attend,
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erro ao inserir novo attendance:', error);
          throw error;
        }
        
        if (newData) {
          console.log('Novo attendance criado:', newData.id);
          setMealAttendance(prev => ({
            ...prev,
            id: newData.id
          }));
        }
      }

      // Salvar na tabela meal_confirmations para contagem em tempo real
      console.log('Tentando salvar na tabela meal_confirmations com os dados:', {
        date: formattedDate,
        meal_type: meal,
        student_id: profile.user_id,
        status: attend,
        student_name: profile.name,
        student_matricula: profile.matricula || '',
        student_image: profile.profile_image || ''
      });
      
      // Tentar atualizar o registro existente primeiro
      const { data: existingData, error: updateError } = await supabase
        .from('meal_confirmations')
        .select('*')
        .eq('date', formattedDate)
        .eq('meal_type', meal)
        .eq('student_id', profile.user_id)
        .maybeSingle();

      console.log('Dados existentes:', existingData);

      if (existingData) {
        console.log('Atualizando confirmação existente:', existingData.id);
        const { data: updateData, error: updateError } = await supabase
          .from('meal_confirmations')
          .update({
            status: attend,
            student_name: profile.name,
            student_matricula: profile.matricula || '',
            student_image: profile.profile_image || '',
          })
          .eq('id', existingData.id)
          .select()
          .single();

        console.log('Resultado da atualização:', { updateData, updateError });

        if (updateError) {
          console.error('Erro ao atualizar confirmação:', updateError);
          throw updateError;
        }
      } else {
        console.log('Inserindo nova confirmação');
        const { data: insertData, error: insertError } = await supabase
          .from('meal_confirmations')
          .insert({
            date: formattedDate,
            meal_type: meal,
            student_id: profile.user_id,
            status: attend,
            student_name: profile.name,
            student_matricula: profile.matricula || '',
            student_image: profile.profile_image || '',
          })
          .select()
          .single();

        console.log('Resultado da inserção:', { insertData, insertError });

        if (insertError) {
          console.error('Erro ao inserir nova confirmação:', insertError);
          throw insertError;
        }
      }
      
      console.log('Confirmação salva com sucesso');
      
      // Criar notificação apenas para o aluno que marcou a presença
      addNotification({
        title: attend ? "Presença atualizada" : "Ausência atualizada",
        description: `Sua ${attend ? 'presença foi confirmada' : 'ausência foi registrada'} para ${getMealName(meal)}.`,
        type: 'meal_attendance',
        target_audience: ['alunos']
      });
      
      toast({
        title: attend ? "Presença atualizada" : "Ausência atualizada",
        description: `Sua ${attend ? 'presença foi confirmada' : 'ausência foi registrada'} para ${getMealName(meal)}.`,
      });
      
      fetchAttendance(profile.user_id, selectedDate);
    } catch (error) {
      console.error('Erro completo ao atualizar presença:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua presença.",
        variant: "destructive",
      });
      
      fetchAttendance(profile.user_id, selectedDate);
    } finally {
      setIsLoading(false);
    }
  };

  const getMealName = (meal: 'breakfast' | 'lunch' | 'snack') => {
    switch (meal) {
      case 'breakfast': return "o café da manhã";
      case 'lunch': return "o almoço";
      case 'snack': return "o lanche da tarde";
    }
  };

  const handleShowQRCode = (mealType: 'breakfast' | 'lunch' | 'snack') => {
    setActiveMealType(mealType);
    setShowQRCode(true);
  };

  const handleShowFeedback = (mealType: 'breakfast' | 'lunch' | 'snack') => {
    setActiveMealType(mealType);
    setShowFeedbackDialog(true);
  };

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
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
            Olá, {profile?.name ? profile.name.split(' ')[0] : 'Aluno(a)'}!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="ml-4">
            <NotificationButton />
          </div>
          <Link to="/settings" className="text-primary hover:text-primary/80 transition-colors">
            <Settings size={24} />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Calendar size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-medium text-black">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>
        
        <DaySelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-6 mb-6">
        <div className="bg-primary text-primary-foreground rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4 text-white">
            {isCurrentDay ? "Confirme sua presença para as refeições:" : "Comparecimento:"}
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium mb-2">Café da Manhã</h3>
                <span className="text-white text-xs">05:00 - 07:30</span>
              </div>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('breakfast', true)}
                    disabled={isLoading || currentTime > mealLimits.breakfast.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.breakfast === true
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('breakfast', false)}
                    disabled={isLoading || currentTime > mealLimits.breakfast.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.breakfast === false
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Não
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      mealAttendance.breakfast === true 
                        ? 'bg-[#f45b43]' 
                        : mealAttendance.breakfast === false 
                        ? 'bg-[#f45b43]' 
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-white">
                    {mealAttendance.breakfast === true 
                      ? 'Compareceu' 
                      : mealAttendance.breakfast === false 
                      ? 'Não compareceu' 
                      : 'Não registrado'}
                  </span>
                </div>
              )}
              
              {mealAttendance.breakfast === true && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleShowQRCode('breakfast')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <QrCode size={16} />
                    <span>QR Code</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium mb-2">Almoço</h3>
                <span className="text-white text-xs">07:30 - 09:40</span>
              </div>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('lunch', true)}
                    disabled={isLoading || currentTime > mealLimits.lunch.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.lunch === true
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('lunch', false)}
                    disabled={isLoading || currentTime > mealLimits.lunch.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.lunch === false
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Não
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      mealAttendance.lunch === true 
                        ? 'bg-[#f45b43]' 
                        : mealAttendance.lunch === false 
                        ? 'bg-[#f45b43]' 
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-white">
                    {mealAttendance.lunch === true 
                      ? 'Compareceu' 
                      : mealAttendance.lunch === false 
                      ? 'Não compareceu' 
                      : 'Não registrado'}
                  </span>
                </div>
              )}
              
              {mealAttendance.lunch === true && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleShowQRCode('lunch')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <QrCode size={16} />
                    <span>QR Code</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium mb-2">Lanche da Tarde</h3>
                <span className="text-white text-xs">12:20 - 14:00</span>
              </div>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('snack', true)}
                    disabled={isLoading || currentTime > mealLimits.snack.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.snack === true
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('snack', false)}
                    disabled={isLoading || currentTime > mealLimits.snack.end}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.snack === false
                        ? 'bg-[#f45b43] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Não
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      mealAttendance.snack === true 
                        ? 'bg-[#f45b43]' 
                        : mealAttendance.snack === false 
                        ? 'bg-[#f45b43]' 
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-white">
                    {mealAttendance.snack === true 
                      ? 'Compareceu' 
                      : mealAttendance.snack === false 
                      ? 'Não compareceu' 
                      : 'Não registrado'}
                  </span>
                </div>
              )}
              
              {mealAttendance.snack === true && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleShowQRCode('snack')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <QrCode size={16} />
                    <span>QR Code</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-primary rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <Utensils size={24} className="text-white mr-2" />
            <h2 className="text-xl lg:text-2xl font-medium text-white">Refeições do dia</h2>
          </div>
          
          <div className="space-y-4">
            <MealCard
              title="Café da Manhã"
              description={menuData?.breakfast || "Cardápio não definido"}
              type="breakfast"
              className="lg:p-4 text-white"
            />
            
            <MealCard
              title="Almoço"
              description={menuData?.lunch || "Cardápio não definido"}
              type="lunch"
              className="lg:p-4 text-white"
            />
            
            <MealCard
              title="Lanche da Tarde"
              description={menuData?.snack || "Cardápio não definido"}
              type="dinner"
              className="lg:p-4 text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="mx-6 mb-3">
        <button 
          onClick={() => setShowFeedbackDialog(true)}
          className="bg-[#f45b43] hover:bg-[#f45b43]/90 text-white w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all"
        >
          <MessageSquare size={18} className="mr-2" />
          <span>Deixar Comentários e Sugestões</span>
        </button>
      </div>
      
      {profile?.user_id && activeMealType && mealAttendance.id && (
        <MealQRCode 
          open={showQRCode} 
          onOpenChange={setShowQRCode}
          studentId={profile.user_id}
          date={format(selectedDate, 'yyyy-MM-dd')}
          mealType={activeMealType}
          attendanceId={mealAttendance.id}
        />
      )}
      
      {showFeedbackDialog && (
        <FeedbackDialog 
          open={showFeedbackDialog} 
          onOpenChange={setShowFeedbackDialog}
          attendance={{
            breakfast: mealAttendance.breakfast,
            lunch: mealAttendance.lunch,
            snack: mealAttendance.snack
          }}
          selectedMealType={activeMealType}
          date={selectedDate}
        />
      )}
    </div>
  );
};

export default Dashboard;
