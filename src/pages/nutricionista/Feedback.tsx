import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import { Settings, MessageSquare, Lightbulb, ArrowLeft, Calendar, Coffee, UtensilsCrossed, Cookie, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExtendedFeedback extends Feedback {
  date?: string;
  profile?: {
    name: string;
    profile_image: string | null;
    dietary_restrictions: string | null;
  }
}

const FeedbackReview = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<ExtendedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'suggestions'>('comments');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            *,
            profile:profiles(name, profile_image, dietary_restrictions)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Get unique dates from feedback
        const uniqueDates = [...new Set(data?.map(item => 
          item.date ? format(new Date(item.date), 'yyyy-MM-dd') : format(new Date(item.created_at), 'yyyy-MM-dd')
        ))];
        setAvailableDates(uniqueDates);
        
        // Type casting to ensure compatibility with our Feedback type
        setFeedback(data as ExtendedFeedback[] || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const getMealLabel = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche da Tarde';
      default: return type;
    }
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Coffee size={16} className="mr-1" />;
      case 'lunch': return <UtensilsCrossed size={16} className="mr-1" />;
      case 'snack': return <Cookie size={16} className="mr-1" />;
      default: return null;
    }
  };

  const getFormattedDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  const filteredFeedback = feedback.filter(item => {
    // Filter by feedback type
    const matchesType = activeTab === 'comments' 
      ? item.feedback_type === 'comment' 
      : item.feedback_type === 'suggestion';
    
    // Filter by date
    const itemDate = item.date || format(new Date(item.created_at), 'yyyy-MM-dd');
    const matchesDate = selectedDate === 'all' || itemDate === selectedDate;
    
    // Filter by meal type
    const matchesMeal = selectedMeal === 'all' || item.meal_type === selectedMeal;
    
    return matchesType && matchesDate && matchesMeal;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={24} className="text-primary" />
          </button>
          <h1 className="text-xl font-medium text-secondary">Feedback dos Alunos</h1>
        </div>
        
        <Link to="/settings" className="text-primary hover:text-primary-dark transition-colors">
          <Settings size={24} />
        </Link>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="comments" onValueChange={(value) => setActiveTab(value as 'comments' | 'suggestions')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="comments" className="flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              <span>Comentários</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center justify-center gap-2">
              <Lightbulb size={16} />
              <span>Sugestões</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={14} className="inline mr-1" />
                Data
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as datas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as datas</SelectItem>
                  {availableDates.map(date => (
                    <SelectItem key={date} value={date}>
                      {getFormattedDate(date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <UtensilsCrossed size={14} className="inline mr-1" />
                Refeição
              </label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as refeições" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as refeições</SelectItem>
                  <SelectItem value="breakfast">
                    <div className="flex items-center">
                      <Coffee size={16} className="mr-2" />
                      Café da Manhã
                    </div>
                  </SelectItem>
                  <SelectItem value="lunch">
                    <div className="flex items-center">
                      <UtensilsCrossed size={16} className="mr-2" />
                      Almoço
                    </div>
                  </SelectItem>
                  <SelectItem value="snack">
                    <div className="flex items-center">
                      <Cookie size={16} className="mr-2" />
                      Lanche da Tarde
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="comments">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p>Nenhum comentário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          {item.profile?.profile_image ? (
                            <img 
                              src={item.profile.profile_image} 
                              alt={item.profile.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.profile?.name || 'Aluno'}</p>
                          {item.profile?.dietary_restrictions && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              {item.profile.dietary_restrictions}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs mb-1">
                          {getMealIcon(item.meal_type)}
                          {getMealLabel(item.meal_type)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getFormattedDate(item.date || item.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="suggestions">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Lightbulb className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p>Nenhuma sugestão encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                          {item.profile?.profile_image ? (
                            <img 
                              src={item.profile.profile_image} 
                              alt={item.profile.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.profile?.name || 'Aluno'}</p>
                          {item.profile?.dietary_restrictions && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              {item.profile.dietary_restrictions}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center bg-secondary/10 text-secondary px-2 py-1 rounded text-xs mb-1">
                          {getMealIcon(item.meal_type)}
                          {getMealLabel(item.meal_type)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getFormattedDate(item.date || item.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackReview;
