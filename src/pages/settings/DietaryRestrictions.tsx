import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import { supabase } from '@/integrations/supabase/client';

const DietaryRestrictions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRestrictions = async () => {
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
        
        // Se já tem restrições cadastradas, redireciona para edição
        if (data && data.dietary_restrictions && data.dietary_restrictions !== 'Nenhuma restrição alimentar') {
          navigate('/settings/dietary-restrictions/edit');
        } else {
          // Se não tem restrições, redireciona para cadastro
          navigate('/settings/dietary-restrictions/add');
        }
      } catch (error) {
        console.error('Error checking dietary restrictions:', error);
        navigate('/settings');
      }
    };
    
    checkRestrictions();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default DietaryRestrictions; 