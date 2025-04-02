import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, startOfDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Coffee, UtensilsCrossed, Soup, Save, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import { Link } from 'react-router-dom';

const WeeklyMenu = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [saving, setSaving] = useState(false);
  const [menuItem, setMenuItem] = useState({
    date: format(selectedDate, 'yyyy-MM-dd'),
    breakfast: '',
    lunch: '',
    snack: ''
  });

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 7);

  useEffect(() => {
    if (user) {
      fetchMenuForDate(selectedDate);
    }
  }, [user, selectedDate]);

  const fetchMenuForDate = async (date: Date) => {
    try {
      console.log('Buscando cardápio para:', format(date, 'yyyy-MM-dd'));
      
      const { data, error } = await supabase
        .from('weekly_menu')
        .select('*')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        console.log('Cardápio encontrado:', data);
        setMenuItem(data);
      } else {
        console.log('Nenhum cardápio encontrado, usando template vazio');
        setMenuItem({
          date: format(date, 'yyyy-MM-dd'),
          breakfast: '',
          lunch: '',
          snack: ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o cardápio.",
        variant: "destructive"
      });
    }
  };

  const handleMenuChange = (field: 'breakfast' | 'lunch' | 'snack', value: string) => {
    setMenuItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveMenu = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar o cardápio.",
        variant: "destructive"
      });
      return;
    }

    if (!menuItem.breakfast && !menuItem.lunch && !menuItem.snack) {
      toast({
        title: "Atenção",
        description: "Preencha pelo menos um dos campos do cardápio.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    console.log('Iniciando salvamento...', menuItem);

    try {
      const itemToSave = {
        date: menuItem.date,
        breakfast: menuItem.breakfast.trim() || 'Cardápio não definido',
        lunch: menuItem.lunch.trim() || 'Cardápio não definido',
        snack: menuItem.snack.trim() || 'Cardápio não definido'
      };

      const { error } = await supabase
        .from('weekly_menu')
        .upsert(itemToSave, {
          onConflict: 'date'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "O cardápio foi salvo com sucesso!",
      });

      await fetchMenuForDate(selectedDate);
    } catch (error) {
      console.error('Erro ao salvar cardápio:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro ao salvar o cardápio",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = addDays(selectedDate, -1);
    if (!isBefore(newDate, today)) {
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (!isAfter(newDate, maxDate)) {
      setSelectedDate(newDate);
    }
  };

  if (saving) {
    return <Loading message="Salvando cardápio..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <BackButton to="/nutricionista/dashboard" label="Gerenciar Cardápio Semanal" />
          <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
            <Settings size={24} />
          </Link>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarDays size={24} className="text-primary mr-2" />
            <h1 className="text-xl font-medium text-primary">Cardápio Semanal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousDay}
              disabled={isSameDay(selectedDate, today)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-lg font-medium text-gray-700">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              disabled={isSameDay(selectedDate, maxDate)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="card-primary animate-in fade-in">
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <Coffee size={18} className="text-secondary mr-2" />
                <h3 className="font-medium text-gray-800">Café da Manhã</h3>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none"
                rows={3}
                placeholder="Descreva o cardápio do café da manhã..."
                value={menuItem.breakfast}
                onChange={(e) => handleMenuChange('breakfast', e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <UtensilsCrossed size={18} className="text-secondary mr-2" />
                <h3 className="font-medium text-gray-800">Almoço</h3>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none"
                rows={3}
                placeholder="Descreva o cardápio do almoço..."
                value={menuItem.lunch}
                onChange={(e) => handleMenuChange('lunch', e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Soup size={18} className="text-secondary mr-2" />
                <h3 className="font-medium text-gray-800">Lanche da Tarde</h3>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none"
                rows={3}
                placeholder="Descreva o cardápio do lanche da tarde..."
                value={menuItem.snack}
                onChange={(e) => handleMenuChange('snack', e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button 
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={handleSaveMenu}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Cardápio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMenu;
