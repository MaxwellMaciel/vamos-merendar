
import React, { useState, useEffect } from 'react';
import { format, isSameDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import DaySelector from '../../components/calendar/DaySelector';
import MealCard from '../../components/meals/MealCard';
import { Calendar, Utensils, QrCode, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import MealQRCode from '@/components/qrcode/MealQRCode';

const Dashboard = () => {
  const { toast } = useToast();
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
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [hasConfirmedMeal, setHasConfirmedMeal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentDay, setIsCurrentDay] = useState(true);

  useEffect(() => {
    // Check if selected date is the current day
    setIsCurrentDay(isSameDay(selectedDate, new Date()));
  }, [selectedDate]);

  useEffect(() => {
    // Get the current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchUserProfile(data.user.id);
        fetchAttendance(data.user.id, selectedDate);
      }
    };
    
    fetchUser();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile by user_id:', error);
        return;
      }
      
      if (data?.name) {
        // Extract first name
        const firstName = data.name.split(' ')[0];
        setUserName(firstName);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
        
        // Check if at least one meal is confirmed
        setHasConfirmedMeal(data.breakfast === true || data.lunch === true || data.snack === true);
      } else {
        // Reset if no data
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
    if (userId) {
      fetchAttendance(userId, date);
    } else {
      // Reset attendance when date changes if no user
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
    if (!userId || !isCurrentDay) return;
    
    try {
      setIsLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Update the local state immediately for better UX
      const newAttendance = {
        ...mealAttendance,
        [meal]: attend,
      };
      
      setMealAttendance(newAttendance);
      
      // Check if there's already an attendance record for this date
      const { data, error: fetchError } = await supabase
        .from('meal_attendance')
        .select('*')
        .eq('student_id', userId)
        .eq('date', formattedDate)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('meal_attendance')
          .update({
            [meal]: attend,
          })
          .eq('id', data.id);
        
        if (error) throw error;
        
        // Update the ID in case it wasn't set yet
        setMealAttendance(prev => ({
          ...prev,
          id: data.id
        }));
      } else {
        // Insert new record
        const { data: newData, error } = await supabase
          .from('meal_attendance')
          .insert({
            student_id: userId,
            date: formattedDate,
            [meal]: attend,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update the ID with the newly created record ID
        if (newData) {
          setMealAttendance(prev => ({
            ...prev,
            id: newData.id
          }));
        }
      }
      
      toast({
        title: attend ? "Presença confirmada" : "Ausência registrada",
        description: `Sua ${attend ? 'presença foi confirmada' : 'ausência foi registrada'} para ${getMealName(meal)}.`,
      });
      
      // Refetch to ensure data consistency
      fetchAttendance(userId, selectedDate);
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua presença.",
        variant: "destructive",
      });
      
      // Revert the local state in case of error
      fetchAttendance(userId, selectedDate);
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
          <h1 className="text-xl font-medium text-secondary">
            Olá, {userName || 'Aluno(a)'}!
          </h1>
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
                      ? 'bg-accent text-primary'
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
                      ? 'bg-accent text-primary'
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
                      ? 'bg-accent text-primary'
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
      </div>
      
      {/* QR Code Dialog */}
      {userId && activeMealType && mealAttendance.id && (
        <MealQRCode 
          open={showQRCode} 
          onOpenChange={setShowQRCode}
          studentId={userId}
          date={format(selectedDate, 'yyyy-MM-dd')}
          mealType={activeMealType}
          attendanceId={mealAttendance.id}
        />
      )}
      
      {/* Feedback Dialog */}
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
        />
      )}
    </div>
  );
};

export default Dashboard;
