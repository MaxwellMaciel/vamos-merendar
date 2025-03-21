
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { toast } from '@/hooks/use-toast';
import { useToast } from '@/hooks/use-toast';

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 500);
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 page-transition bg-gradient-to-b from-white to-gray-50">
      <Logo size="lg" className="mb-6" />

      <h1 className="text-2xl font-bold text-primary text-center mb-2">
        Seja bem-vindo(a)!
      </h1>

      <p className="text-center text-gray-600 mb-8 max-w-xs">
        O Vamos Merendar está aqui para te ajudar a fazer a diferença. Transforme a
        hora da merenda escolar em um momento de conscientização e ação. Cada passo
        conta, e você faz parte desse movimento! Vamos Merendar e fazer do mundo um
        lugar melhor?
      </p>

      <button 
        onClick={handleLogin}
        disabled={loading}
        className="btn-secondary w-full max-w-xs mb-3"
      >
        {loading ? 'Carregando...' : 'Fazer login'}
      </button>

      <div className="flex items-center justify-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <button 
          onClick={handleCreateAccount}
          className="ml-1 text-secondary font-medium hover:underline"
        >
          Crie uma conta
        </button>
      </div>
    </div>
  );
};

export default Welcome;
