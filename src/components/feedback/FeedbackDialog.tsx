
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: {
    breakfast: boolean | null;
    lunch: boolean | null;
    snack: boolean | null;
  };
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ 
  open, 
  onOpenChange,
  attendance = { breakfast: null, lunch: null, snack: null } 
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [feedbackType, setFeedbackType] = useState('comment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to get the first confirmed meal for default tab
  const getDefaultMeal = () => {
    if (attendance.breakfast === true) return 'breakfast';
    if (attendance.lunch === true) return 'lunch';
    if (attendance.snack === true) return 'snack';
    return 'breakfast'; // Fallback
  };

  const handleSubmit = async () => {
    if (!feedback) {
      toast({
        title: "Feedback vazio",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Make sure the user confirmed attendance for this meal
    if (attendance[selectedMeal as keyof typeof attendance] !== true) {
      toast({
        title: "Atenção",
        description: "Você só pode enviar feedback para refeições que confirmou presença.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        throw new Error('Usuário não autenticado.');
      }

      const { error } = await supabase.from('feedback').insert({
        student_id: userData.user.id,
        meal_type: selectedMeal,
        feedback_type: feedbackType,
        content: feedback
      });

      if (error) throw error;

      toast({
        title: "Feedback enviado",
        description: "Obrigado por compartilhar sua opinião!",
      });

      setFeedback('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">Deixe seu comentário</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={getDefaultMeal()} onValueChange={setSelectedMeal}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="breakfast" 
              className="flex items-center gap-2"
              disabled={attendance.breakfast !== true}
            >
              <Coffee size={16} />
              <span>Café</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lunch" 
              className="flex items-center gap-2"
              disabled={attendance.lunch !== true}
            >
              <UtensilsCrossed size={16} />
              <span>Almoço</span>
            </TabsTrigger>
            <TabsTrigger 
              value="snack" 
              className="flex items-center gap-2"
              disabled={attendance.snack !== true}
            >
              <Cookie size={16} />
              <span>Lanche</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-gray-50 rounded-lg p-3 mt-3 mb-3">
            <div className="text-sm text-gray-700 font-medium mb-2">Tipo de feedback:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button"
                variant={feedbackType === 'comment' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setFeedbackType('comment')}
              >
                Comentário
              </Button>
              <Button 
                type="button"
                variant={feedbackType === 'suggestion' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setFeedbackType('suggestion')}
              >
                Sugestão
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva seu feedback aqui..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] rounded-lg border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
