import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { format } from 'date-fns';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: {
    breakfast: boolean | null;
    lunch: boolean | null;
    snack: boolean | null;
  };
  selectedMealType?: 'breakfast' | 'lunch' | 'snack';
  date: Date;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ 
  open, 
  onOpenChange,
  attendance,
  selectedMealType,
  date
}) => {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState<'comment' | 'suggestion'>('comment');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack'>(selectedMealType || 'breakfast');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (data) {
            setProfileId(data.id);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    if (open) {
      fetchUserProfile();
    }
  }, [open]);

  const getEnabledMeals = () => {
    // Se for sugestão, todas as refeições estão habilitadas
    if (feedbackType === 'suggestion') {
      return {
        breakfast: true,
        lunch: true,
        snack: true
      };
    }
    // Se for comentário, só habilita as refeições com presença confirmada
    return {
      breakfast: attendance.breakfast === true,
      lunch: attendance.lunch === true,
      snack: attendance.snack === true
    };
  };

  const getInitialMealType = () => {
    const enabledMeals = getEnabledMeals();
    
    if (selectedMealType && enabledMeals[selectedMealType]) {
      return selectedMealType;
    }
    
    if (enabledMeals.breakfast) return 'breakfast';
    if (enabledMeals.lunch) return 'lunch';
    if (enabledMeals.snack) return 'snack';
    
    return 'breakfast'; // Fallback
  };

  React.useEffect(() => {
    if (open) {
      setMealType(getInitialMealType());
      setContent('');
    }
  }, [open, attendance, selectedMealType, feedbackType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite seu feedback antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { error } = await supabase.from('feedback').insert({
        student_id: userData.user.id,
        profile_id: profileId,
        feedback_type: feedbackType,
        meal_type: mealType,
        content,
        date: formattedDate
      });
      
      if (error) throw error;
      
      toast({
        title: "Feedback enviado",
        description: "Agradecemos seu feedback! Ele é muito importante para melhorarmos o serviço.",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      
      toast({
        title: "Erro ao enviar feedback",
        description: error.message || "Ocorreu um erro ao enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const enabledMeals = getEnabledMeals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 shadow-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            {feedbackType === 'comment' ? 'Deixe seu comentário' : 'Faça uma sugestão'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-3">
          <button 
            type="button"
            onClick={() => setFeedbackType('comment')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              feedbackType === 'comment' 
                ? 'bg-[#f45b43] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Comentário
          </button>
          <button 
            type="button"
            onClick={() => setFeedbackType('suggestion')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              feedbackType === 'suggestion' 
                ? 'bg-[#f45b43] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sugestão
          </button>
        </div>
        
        <Tabs defaultValue={mealType} value={mealType} onValueChange={(value) => setMealType(value as any)}>
          <TabsList className="grid w-full grid-cols-3 gap-2 p-1 mb-2">
            <TabsTrigger 
              value="breakfast" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg data-[state=active]:bg-[#244b2c] data-[state=active]:text-white"
              disabled={!enabledMeals.breakfast}
            >
              <Coffee size={18} />
              <span className="text-sm">Café</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lunch" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg data-[state=active]:bg-[#244b2c] data-[state=active]:text-white"
              disabled={!enabledMeals.lunch}
            >
              <UtensilsCrossed size={18} />
              <span className="text-sm">Almoço</span>
            </TabsTrigger>
            <TabsTrigger 
              value="snack" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg data-[state=active]:bg-[#244b2c] data-[state=active]:text-white"
              disabled={!enabledMeals.snack}
            >
              <Cookie size={18} />
              <span className="text-sm">Lanche</span>
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Digite seu ${feedbackType === 'comment' ? 'comentário' : 'sugestão'} sobre a refeição...`}
                  className="w-full h-32 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f45b43] focus:border-transparent resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f45b43] hover:bg-[#f45b43]/90 text-white font-medium py-2 rounded-md transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
