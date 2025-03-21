
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, LightbulbIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva algum conteúdo antes de enviar.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {feedbackType === 'comment' ? 'Deixe seu comentário' : 'Faça uma sugestão'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="comment" onValueChange={(value) => setFeedbackType(value as 'comment' | 'suggestion')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comment" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Comentário</span>
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex items-center gap-2">
              <LightbulbIcon size={16} />
              <span>Sugestão</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comment" className="pt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="meal-type" className="block text-sm font-medium mb-1">
                  Sobre qual refeição você gostaria de comentar?
                </label>
                <select
                  id="meal-type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'snack')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="breakfast">Café da Manhã</option>
                  <option value="lunch">Almoço</option>
                  <option value="snack">Lanche da Tarde</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="comment-content" className="block text-sm font-medium mb-1">
                  Seu comentário:
                </label>
                <textarea
                  id="comment-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="O que você achou da refeição? Como podemos melhorar?"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestion" className="pt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="suggestion-meal-type" className="block text-sm font-medium mb-1">
                  Para qual refeição é sua sugestão?
                </label>
                <select
                  id="suggestion-meal-type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'snack')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="breakfast">Café da Manhã</option>
                  <option value="lunch">Almoço</option>
                  <option value="snack">Lanche da Tarde</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="suggestion-content" className="block text-sm font-medium mb-1">
                  Sua sugestão de prato:
                </label>
                <textarea
                  id="suggestion-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Qual prato você gostaria de sugerir para o cardápio?"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-4">
          <DialogClose className="px-4 py-2 border border-gray-300 rounded-md">
            Cancelar
          </DialogClose>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
