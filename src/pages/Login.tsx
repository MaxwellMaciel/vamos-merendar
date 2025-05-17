import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import PasswordInput from '../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../components/Loading';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Obtém a URL de redirecionamento do estado da localização ou usa a rota padrão
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      // Redireciona para a página que o usuário tentou acessar ou para a rota padrão
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Realizando login..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                  <IdCard size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-primary pl-10 w-full shadow-md"
                />
              </div>
            </div>
            
            <PasswordInput
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-md bg-white"
            />
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#f45b43] hover:bg-[#f45b43]/90 text-white py-3 px-4 rounded-lg font-medium transition-all"
              >
                Entrar
              </button>
            </div>

            <div className="flex justify-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="px-4 text-sm text-gray-500">ou entre como</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="mt-6">
            <Link
              to="/nutricionista/login"
              className="btn-outline text-center text-sm py-2 shadow-md w-full block"
            >
              Nutricionista
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-[#f45b43] font-medium hover:underline">
                Cadastre-se
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;