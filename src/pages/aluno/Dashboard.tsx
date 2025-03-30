import React, { useState, useEffect } from 'react';
import { format, isSameDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import MealCard from '../../components/meals/MealCard';
import { Calendar, Utensils, QrCode, MessageSquare, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import MealQRCode from '@/components/qrcode/MealQRCode';
import { useProfile } from '@/hooks/use-profile';
import NotificationButton from '@/components/ui/NotificationButton';
import { useNotifications } from '../../contexts/NotificationContext';

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

  useEffect(() => {
    setIsCurrentDay(isSameDay(selectedDate, new Date()));
  }, [selectedDate]);

  useEffect(() => {
    if (profile?.user_id) {
      fetchAttendance(profile.user_id, selectedDate);
    }
  }, [profile, selectedDate]);

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
    if (!profile?.user_id || !isCurrentDay) return;
    
    try {
      setIsLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const newAttendance = {
        ...mealAttendance,
        [meal]: attend,
      };
      
      setMealAttendance(newAttendance);
      
      const { data, error: fetchError } = await supabase
        .from('meal_attendance')
        .select('*')
        .eq('student_id', profile.user_id)
        .eq('date', formattedDate)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        const { error } = await supabase
          .from('meal_attendance')
          .update({
            [meal]: attend,
          })
          .eq('id', data.id);
        
        if (error) throw error;
        
        setMealAttendance(prev => ({
          ...prev,
          id: data.id
        }));
      } else {
        const { data: newData, error } = await supabase
          .from('meal_attendance')
          .insert({
            student_id: profile.user_id,
            date: formattedDate,
            [meal]: attend,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        if (newData) {
          setMealAttendance(prev => ({
            ...prev,
            id: newData.id
          }));
        }
      }
      
      addNotification({
        title: attend ? "Presença confirmada" : "Ausência registrada",
        description: `Sua ${attend ? 'presença foi confirmada' : 'ausência foi registrada'} para ${getMealName(meal)}.`,
        date: new Date(),
        type: 'meal_attendance'
      });
      
      toast({
        title: attend ? "Presença confirmada" : "Ausência registrada",
        description: `Sua ${attend ? 'presença foi confirmada' : 'ausência foi registrada'} para ${getMealName(meal)}.`,
      });
      
      fetchAttendance(profile.user_id, selectedDate);
    } catch (error) {
      console.error('Error updating attendance:', error);
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

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="flex justify-between items-center px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3 overflow-hidden">
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
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
                className="text-primary-foreground"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
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
          <h2 className="text-lg font-medium text-foreground">
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
              <h3 className="text-white font-medium mb-2">Café da Manhã</h3>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('breakfast', true)}
                    disabled={isLoading}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.breakfast === true
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('breakfast', false)}
                    disabled={isLoading}
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
                        ? 'bg-green-500' 
                        : mealAttendance.breakfast === false 
                        ? 'bg-red-500' 
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
                  <button 
                    onClick={() => handleShowFeedback('breakfast')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <MessageSquare size={16} />
                    <span>Comentário</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h3 className="text-white font-medium mb-2">Almoço</h3>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('lunch', true)}
                    disabled={isLoading}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.lunch === true
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('lunch', false)}
                    disabled={isLoading}
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
                        ? 'bg-green-500' 
                        : mealAttendance.lunch === false 
                        ? 'bg-red-500' 
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
                  <button 
                    onClick={() => handleShowFeedback('lunch')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <MessageSquare size={16} />
                    <span>Comentário</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h3 className="text-white font-medium mb-2">Lanche da Tarde</h3>
              
              {isCurrentDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttendance('snack', true)}
                    disabled={isLoading}
                    className={`py-2 rounded-md font-medium transition-all ${
                      mealAttendance.snack === true
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('snack', false)}
                    disabled={isLoading}
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
                        ? 'bg-green-500' 
                        : mealAttendance.snack === false 
                        ? 'bg-red-500' 
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
                  <button 
                    onClick={() => handleShowFeedback('snack')}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 transition-colors text-white py-1.5 px-2 rounded"
                  >
                    <MessageSquare size={16} />
                    <span>Comentário</span>
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
              description="Pão, manteiga, café com leite"
              type="breakfast"
              className="lg:p-4"
            />
            
            <MealCard
              title="Almoço"
              description="Arroz, feijão, carne, salada"
              type="lunch"
              className="lg:p-4"
            />
            
            <MealCard
              title="Lanche da Tarde"
              description="Suco de laranja, bolo de chocolate"
              type="dinner"
              className="lg:p-4"
            />
          </div>
        </div>
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
      
      {activeMealType && (
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
