import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/Loading';

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
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        // Se já tem restrições cadastradas, redireciona para edição
        if (data?.dietary_restrictions && data.dietary_restrictions !== 'Nenhuma restrição alimentar') {
          navigate('/settings/dietary-restrictions/edit', { replace: true });
        } else {
          // Se não tem restrições, redireciona para cadastro
          navigate('/settings/dietary-restrictions/add', { replace: true });
        }
      } catch (error) {
        console.error('Error checking dietary restrictions:', error);
        navigate('/settings', { replace: true });
      }
    };
    
    checkRestrictions();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      <div className="flex-1 flex items-center justify-center">
        <Loading message="Carregando..." />
      </div>
    </div>
  );
};

export default DietaryRestrictions; 