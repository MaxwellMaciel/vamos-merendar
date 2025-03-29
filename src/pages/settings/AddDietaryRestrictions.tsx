import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coffee } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AddDietaryRestrictions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restrictions.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, descreva suas restrições alimentares.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Update profile with dietary restrictions
      const { error } = await supabase.from('profiles').update({
        dietary_restrictions: restrictions,
      }).eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Restrições alimentares cadastradas",
        description: "Suas restrições alimentares foram cadastradas com sucesso.",
      });
      
      navigate('/settings');
    } catch (error: any) {
      console.error('Error saving dietary restrictions:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao cadastrar suas restrições alimentares.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Restrições Alimentares" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Coffee size={36} className="text-primary" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6 text-[#244b2c]">
          Cadastrar Restrições Alimentares
        </h2>
        
        <p className="text-center text-muted-foreground mb-6">
          Informe suas restrições alimentares para que possamos adaptar seu cardápio:
        </p>
        
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="restrictions" className="block mb-2 text-[#244b2c]">
                Descreva suas restrições alimentares:
              </Label>
              <Textarea
                id="restrictions"
                placeholder="Ex: Intolerância à lactose, alergia a nozes, vegetariano, etc."
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                className="resize-none h-32 bg-white/30 shadow-md"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !restrictions.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="w-full border border-border text-foreground font-medium py-3 rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDietaryRestrictions; 