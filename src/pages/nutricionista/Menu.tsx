import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type MenuItem = {
  id?: number;
  date: string;
  breakfast: string;
  lunch: string;
  snack: string;
  created_at?: string;
};

export default function Menu() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetchMenuItems();
  }, [currentWeek]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_menu')
        .select('*')
        .gte('date', weekStart.toISOString())
        .lte('date', addDays(weekStart, 4).toISOString());

      if (error) throw error;

      setMenuItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar cardápios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cardápios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const menuItemsToSave = weekDays.map(day => {
        const existingItem = menuItems.find(item => 
          isSameDay(new Date(item.date), day)
        );
        
        return {
          id: existingItem?.id,
          date: day.toISOString(),
          breakfast: existingItem?.breakfast || '',
          lunch: existingItem?.lunch || '',
          snack: existingItem?.snack || '',
        };
      });

      const { error } = await supabase
        .from('weekly_menu')
        .upsert(menuItemsToSave, {
          onConflict: 'date',
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cardápio semanal salvo com sucesso!",
      });
      
      fetchMenuItems();
    } catch (error) {
      console.error('Erro ao salvar cardápios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os cardápios.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (date: Date, field: keyof MenuItem, value: string) => {
    setMenuItems(prev => {
      const existingItem = prev.find(item => 
        isSameDay(new Date(item.date), date)
      );
      
      if (existingItem) {
        return prev.map(item => 
          isSameDay(new Date(item.date), date)
            ? { ...item, [field]: value }
            : item
        );
      }
      
      return [...prev, {
        date: date.toISOString(),
        breakfast: field === 'breakfast' ? value : '',
        lunch: field === 'lunch' ? value : '',
        snack: field === 'snack' ? value : '',
      }];
    });
  };

  const getValueForDay = (date: Date, field: keyof MenuItem) => {
    const item = menuItems.find(item => 
      isSameDay(new Date(item.date), date)
    );
    return item?.[field] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mx-4">
              {format(weekStart, "d 'de' MMMM", { locale: ptBR })}
            </h1>
            <button
              onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#f45b43] hover:bg-[#f45b43]/90 text-white"
          >
            {saving ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Salvando...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Salvar Cardápio
              </span>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 mb-4">
                {format(day, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Café da Manhã
                  </label>
                  <Textarea
                    value={getValueForDay(day, 'breakfast')}
                    onChange={(e) => handleInputChange(day, 'breakfast', e.target.value)}
                    className="w-full"
                    rows={3}
                    placeholder="Digite o cardápio do café da manhã"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Almoço
                  </label>
                  <Textarea
                    value={getValueForDay(day, 'lunch')}
                    onChange={(e) => handleInputChange(day, 'lunch', e.target.value)}
                    className="w-full"
                    rows={3}
                    placeholder="Digite o cardápio do almoço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lanche da Tarde
                  </label>
                  <Textarea
                    value={getValueForDay(day, 'snack')}
                    onChange={(e) => handleInputChange(day, 'snack', e.target.value)}
                    className="w-full"
                    rows={3}
                    placeholder="Digite o cardápio do lanche"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 