
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import { Settings, MessageSquare, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FeedbackReview = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'suggestions'>('comments');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Type casting to ensure compatibility with our Feedback type
        setFeedback(data as Feedback[] || []);
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

  const filteredFeedback = feedback.filter(item => 
    activeTab === 'comments' 
      ? item.feedback_type === 'comment' 
      : item.feedback_type === 'suggestion'
  );

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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="comments" className="flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              <span>Comentários</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center justify-center gap-2">
              <Lightbulb size={16} />
              <span>Sugestões</span>
            </TabsTrigger>
          </TabsList>
          
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {getMealLabel(item.meal_type)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(item.created_at), "dd 'de' MMMM", { locale: ptBR })}
                      </div>
                    </div>
                    <p className="text-gray-800">{item.content}</p>
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                        {getMealLabel(item.meal_type)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(item.created_at), "dd 'de' MMMM", { locale: ptBR })}
                      </div>
                    </div>
                    <p className="text-gray-800">{item.content}</p>
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
