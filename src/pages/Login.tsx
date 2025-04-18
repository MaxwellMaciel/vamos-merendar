import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import PasswordInput from '../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../components/Loading';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Apenas marcar que a página terminou de carregar
    setIsPageLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!matricula || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Iniciando processo de login...');
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('matricula', matricula)
        .single();

      if (profileError || !profile) {
        throw new Error('Matrícula não encontrada.');
      }

      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email: profile.email.toLowerCase(),
        password: password
      });

      if (loginError) throw loginError;

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profile.name}!`,
      });

      // Verificar se é o primeiro login do usuário
      const userId = authData.user?.id;
      const welcomeShown = localStorage.getItem(`welcome_shown_${userId}`);
      
      if (!welcomeShown && userId) {
        // Marcar que a tela de boas-vindas foi mostrada para este usuário
        localStorage.setItem(`welcome_shown_${userId}`, 'true');
        // Redirecionar para a página de boas-vindas
        navigate('/welcome');
        return;
      }

      // Redirecionamento normal para o dashboard
      if (profile.user_type === 'aluno') {
        navigate('/aluno/dashboard');
      } else if (profile.user_type === 'nutricionista') {
        navigate('/nutricionista/dashboard');
      } else {
        navigate('/aluno/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message === 'Matrícula não encontrada.') {
        setError('Matrícula não encontrada. Verifique se digitou corretamente.');
      } else if (error.message === 'Invalid login credentials') {
        setError('Senha incorreta. Verifique se digitou corretamente.');
      } else {
        setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return <Loading message="Carregando página de login..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-[#f45b43]/10 border border-[#f45b43]/20 rounded-lg text-[#f45b43] text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                  <IdCard size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Matrícula/SIAPE"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
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
                disabled={loading}
                className="w-full bg-[#f45b43] hover:bg-[#f45b43]/90 text-white py-3 px-4 rounded-lg font-medium transition-all"
              >
                {loading ? 'Entrando...' : 'Entrar'}
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