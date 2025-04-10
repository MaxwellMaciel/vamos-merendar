import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Verificar o tipo de usuário para redirecionar adequadamente
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.user_type) {
          setUserType(profile.user_type);
        }
      }
    };
    
    checkUserType();
  }, []);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Redirecionar para o dashboard adequado com base no tipo de usuário
      if (userType === 'aluno') {
        navigate('/aluno/dashboard');
      } else if (userType === 'professor') {
        navigate('/professor/dashboard');
      } else if (userType === 'nutricionista') {
        navigate('/nutricionista/dashboard');
      } else {
        // Fallback para a página de login se não conseguir determinar o tipo de usuário
        navigate('/login');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 page-transition bg-gradient-to-b from-white to-gray-50">
      <Logo size="lg" className="mb-6" />

      <h1 className="text-2xl font-bold text-[#f45b43] text-center mb-2">
        Seja bem-vindo(a)!
      </h1>

      <p className="text-center text-gray-600 mb-8 max-w-xs">
        O Vamos Merendar está aqui para te ajudar a fazer a diferença. Transforme a
        hora da merenda escolar em um momento de conscientização e ação. Cada passo
        conta, e você faz parte desse movimento! Vamos Merendar e fazer do mundo um
        lugar melhor?
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button 
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#f45b43] text-white py-3 px-4 rounded-lg font-medium transition-all hover:bg-[#f45b43]/90 active:scale-[0.98] w-full"
        >
          {loading ? 'Carregando...' : 'Continuar'}
        </button>
        
        <button 
          onClick={() => {
            if (userType === 'aluno') {
              navigate('/aluno/dashboard');
            } else if (userType === 'professor') {
              navigate('/professor/dashboard');
            } else if (userType === 'nutricionista') {
              navigate('/nutricionista/dashboard');
            } else {
              navigate('/login');
            }
          }}
          className="text-gray-500 text-sm hover:underline w-full text-center py-2"
        >
          Pular
        </button>
      </div>
    </div>
  );
};

export default Welcome;
