
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (to === '/aluno/dashboard' || to === '/professor/dashboard' || to === '/nutricionista/dashboard') {
      // Try to determine user type for better navigation
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();
          
          if (data?.user_type) {
            navigate(`/${data.user_type}/dashboard`);
            return;
          }
        }
      } catch (error) {
        console.error('Error getting user type:', error);
      }
    }
    
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center text-primary hover:text-primary-dark transition-colors py-2"
    >
      <ChevronLeft size={20} />
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
};

export default BackButton;
