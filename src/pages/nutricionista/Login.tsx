import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import PasswordInput from '../../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../../components/Loading';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [siape, setSiape] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Apenas marcar que a página terminou de carregar
    setIsPageLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!siape || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('siape', siape)
        .single();

      if (profileError || !profile) {
        throw new Error('SIAPE não encontrado.');
      }

      if (profile.user_type !== 'nutricionista') {
        throw new Error('Este usuário não é um nutricionista.');
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

      navigate('/nutricionista/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message === 'SIAPE não encontrado.') {
        setError('SIAPE não encontrado. Verifique se digitou corretamente.');
      } else if (error.message === 'Este usuário não é um nutricionista.') {
        setError('Este SIAPE não pertence a um nutricionista.');
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
                  placeholder="SIAPE"
                  value={siape}
                  onChange={(e) => setSiape(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
