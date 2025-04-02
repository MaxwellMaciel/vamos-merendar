import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coffee } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditDietaryRestrictions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchRestrictions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Fetch current restrictions
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_restrictions')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.dietary_restrictions) {
          setRestrictions(data.dietary_restrictions);
        }
      } catch (error) {
        console.error('Error fetching dietary restrictions:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas restrições alimentares.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchRestrictions();
  }, [navigate, toast]);

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
        title: "Restrições alimentares atualizadas",
        description: "Suas restrições alimentares foram atualizadas com sucesso.",
      });
      
      navigate('/settings');
    } catch (error: any) {
      console.error('Error updating dietary restrictions:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar suas restrições alimentares.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background page-transition">
        <StatusBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4 border-b border-gray-100">
        <BackButton to="/settings/dietary-restrictions" label="Editar Restrição" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Coffee size={36} className="text-primary" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6 text-[#244b2c]">
          Editar Restrições Alimentares
        </h2>
        
        <p className="text-center text-muted-foreground mb-6">
          Atualize suas restrições alimentares para que possamos adaptar seu cardápio:
        </p>
        
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="restrictions" className="block mb-2 text-[#244b2c]">
                Suas restrições alimentares:
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
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

export default EditDietaryRestrictions; 