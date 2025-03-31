import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

interface LocationState {
  userId: string;
  userData: {
    name: string;
    email: string;
    matricula: string | null;
    siape: string | null;
    phone: string;
    user_type: string;
  };
}

const DietaryRestrictions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId, userData } = (location.state as LocationState) || { 
    userId: '', 
    userData: { 
      name: '', 
      email: '', 
      matricula: null,
      siape: null,
      phone: '',
      user_type: 'aluno'
    } 
  };
  
  const [hasRestriction, setHasRestriction] = useState<string>('no');
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!userId) {
    // Redirect to register if no userId is provided
    navigate('/register');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const restrictionsData = hasRestriction === 'yes' ? restrictions : 'Nenhuma restrição alimentar';
      
      // Create profile with dietary restrictions
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        user_id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        matricula: userData.matricula,
        siape: userData.siape,
        dietary_restrictions: restrictionsData,
        user_type: userData.user_type
      });
      
      if (error) throw error;
      
      toast({
        title: "Restrições alimentares salvas",
        description: "Suas informações foram registradas com sucesso.",
      });
      
      navigate('/registration-success');
    } catch (error: any) {
      console.error('Error saving dietary restrictions:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar suas restrições alimentares.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6 flex justify-center">
          <div className="bg-accent/30 p-3 rounded-lg shadow-sm">
            <CheckCircle size={32} className="text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          Quase lá!
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Por favor, informe se você possui alguma restrição alimentar:
        </p>
        
        <div className="w-full max-w-sm mx-auto">
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
              <button
                type="submit"
                disabled={loading || (hasRestriction === 'yes' && !restrictions.trim())}
                className="w-full bg-[#f45b43] hover:bg-[#f45b43]/90 text-white py-3 px-4 rounded-lg font-medium transition-all"
              >
                {loading ? 'Salvando...' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DietaryRestrictions;
