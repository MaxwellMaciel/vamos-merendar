
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, LightbulbIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState<'comment' | 'suggestion'>('comment');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack'>('lunch');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableMeals, setAvailableMeals] = useState<{
    breakfast: boolean;
    lunch: boolean;
    snack: boolean;
  }>({
    breakfast: false,
    lunch: false,
    snack: false
  });

  useEffect(() => {
    // Ao abrir o diálogo, verificar as refeições em que o aluno esteve presente hoje
    if (open) {
      fetchAttendance();
    }
  }, [open]);

  const fetchAttendance = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('meal_attendance')
        .select('breakfast, lunch, snack')
        .eq('student_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setAvailableMeals({
          breakfast: data.breakfast === true,
          lunch: data.lunch === true,
          snack: data.snack === true
        });
        
        // Define a refeição inicial selecionável com base na presença
        if (data.lunch === true) setMealType('lunch');
        else if (data.breakfast === true) setMealType('breakfast');
        else if (data.snack === true) setMealType('snack');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva algum conteúdo antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o usuário esteve presente na refeição
    if (!availableMeals[mealType]) {
      toast({
        title: "Erro",
        description: "Você só pode comentar sobre refeições em que esteve presente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('feedback').insert({
        student_id: (await supabase.auth.getUser()).data.user?.id,
        feedback_type: feedbackType,
        meal_type: mealType,
        content
      });

      if (error) throw error;

      toast({
        title: feedbackType === 'comment' ? "Comentário enviado" : "Sugestão enviada",
        description: "Agradecemos pelo seu feedback!",
      });
      
      setContent('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMealLabel = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche da Tarde';
      default: return '';
    }
  };

  const noAvailableMeals = !availableMeals.breakfast && !availableMeals.lunch && !availableMeals.snack;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            {feedbackType === 'comment' ? 'Deixe seu comentário' : 'Faça uma sugestão'}
          </DialogTitle>
        </DialogHeader>
        
        {noAvailableMeals ? (
          <div className="p-6 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-amber-600">Você precisa confirmar presença em alguma refeição hoje para poder deixar um comentário.</p>
            </div>
            <DialogClose className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md">
              Entendi
            </DialogClose>
          </div>
        ) : (
          <>
            <Tabs defaultValue="comment" onValueChange={(value) => setFeedbackType(value as 'comment' | 'suggestion')}>
              <TabsList className="grid w-full grid-cols-2 rounded-md overflow-hidden">
                <TabsTrigger value="comment" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <MessageSquare size={16} />
                  <span>Comentário</span>
                </TabsTrigger>
                <TabsTrigger value="suggestion" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <LightbulbIcon size={16} />
                  <span>Sugestão</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="comment" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="meal-type" className="block text-sm font-medium mb-2 text-gray-700">
                      Sobre qual refeição você gostaria de comentar?
                    </label>
                    <select
                      id="meal-type"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'snack')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={noAvailableMeals}
                    >
                      <option value="breakfast" disabled={!availableMeals.breakfast}>
                        Café da Manhã {!availableMeals.breakfast && '(Sem presença confirmada)'}
                      </option>
                      <option value="lunch" disabled={!availableMeals.lunch}>
                        Almoço {!availableMeals.lunch && '(Sem presença confirmada)'}
                      </option>
                      <option value="snack" disabled={!availableMeals.snack}>
                        Lanche da Tarde {!availableMeals.snack && '(Sem presença confirmada)'}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="comment-content" className="block text-sm font-medium mb-2 text-gray-700">
                      Seu comentário:
                    </label>
                    <textarea
                      id="comment-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="O que você achou da refeição? Como podemos melhorar?"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="suggestion" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="suggestion-meal-type" className="block text-sm font-medium mb-2 text-gray-700">
                      Para qual refeição é sua sugestão?
                    </label>
                    <select
                      id="suggestion-meal-type"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'snack')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={noAvailableMeals}
                    >
                      <option value="breakfast" disabled={!availableMeals.breakfast}>
                        Café da Manhã {!availableMeals.breakfast && '(Sem presença confirmada)'}
                      </option>
                      <option value="lunch" disabled={!availableMeals.lunch}>
                        Almoço {!availableMeals.lunch && '(Sem presença confirmada)'}
                      </option>
                      <option value="snack" disabled={!availableMeals.snack}>
                        Lanche da Tarde {!availableMeals.snack && '(Sem presença confirmada)'}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="suggestion-content" className="block text-sm font-medium mb-2 text-gray-700">
                      Sua sugestão de prato:
                    </label>
                    <textarea
                      id="suggestion-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="Qual prato você gostaria de sugerir para o cardápio?"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-3 mt-4">
              <DialogClose className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Cancelar
              </DialogClose>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || noAvailableMeals}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
