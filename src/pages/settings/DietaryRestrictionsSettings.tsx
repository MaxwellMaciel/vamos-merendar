
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coffee, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loading from '@/components/Loading';

const DietaryRestrictionsSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasRestriction, setHasRestriction] = useState<string>('no');
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasExistingRestrictions, setHasExistingRestrictions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserId(user.id);
        
        // Fetch current restrictions
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_restrictions')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.dietary_restrictions && data.dietary_restrictions !== 'Nenhuma restrição alimentar') {
          setHasExistingRestrictions(true);
          setHasRestriction('yes');
          setRestrictions(data.dietary_restrictions);
        } else {
          setHasExistingRestrictions(false);
          setHasRestriction('no');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas restrições alimentares.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar suas restrições.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const restrictionsData = hasRestriction === 'yes' ? restrictions : 'Nenhuma restrição alimentar';
      
      // Update profile with dietary restrictions
      const { error } = await supabase.from('profiles').update({
        dietary_restrictions: restrictionsData,
      }).eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Restrições alimentares atualizadas",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      setHasExistingRestrictions(hasRestriction === 'yes');
      setShowEditForm(false);
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
    return <Loading message="Carregando suas informações..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
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
        
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Restrições Alimentares
        </h2>
        
        {!showEditForm && hasExistingRestrictions ? (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Suas restrições:</h3>
              <p className="text-gray-800">{restrictions}</p>
            </div>
            
            <Button 
              onClick={() => setShowEditForm(true)}
              className="w-full"
            >
              Editar Restrições Alimentares
            </Button>
          </div>
        ) : !showEditForm && !hasExistingRestrictions ? (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <p className="text-gray-600 mb-4">Nenhuma restrição alimentar detectada</p>
              <Button 
                onClick={() => setShowEditForm(true)}
                className="flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Restrição Alimentar
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <p className="text-center text-gray-600 mb-6">
              Informe se você possui alguma restrição alimentar para que possamos adaptar seu cardápio:
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup 
                defaultValue="no" 
                value={hasRestriction}
                onValueChange={setHasRestriction}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-restrictions" />
                  <Label htmlFor="no-restrictions">Não tenho restrições alimentares</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-restrictions" />
                  <Label htmlFor="has-restrictions">Tenho restrições alimentares</Label>
                </div>
              </RadioGroup>
              
              {hasRestriction === 'yes' && (
                <div className="animate-in fade-in duration-200">
                  <Label htmlFor="restrictions" className="block mb-2">
                    Descreva suas restrições alimentares:
                  </Label>
                  <Textarea
                    id="restrictions"
                    placeholder="Ex: Intolerância à lactose, alergia a nozes, vegetariano, etc."
                    value={restrictions}
                    onChange={(e) => setRestrictions(e.target.value)}
                    className="resize-none h-32"
                  />
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || (hasRestriction === 'yes' && !restrictions.trim())}
                  className="w-full mb-3"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietaryRestrictionsSettings;
