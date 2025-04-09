import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import PasswordInput from '../../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../../components/Loading';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [siape, setSiape] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Verificar se existem credenciais salvas
    const checkSavedCredentials = async () => {
      try {
        const { data: savedCred } = await supabase
          .from('saved_credentials')
          .select('siape, remember_token')
          .single();

        if (savedCred?.siape && savedCred?.remember_token) {
          setSiape(savedCred.siape);
          setRememberMe(true);
          // Tentar login automático
          handleAutoLogin(savedCred.siape, savedCred.remember_token);
        }
      } catch (error) {
        console.error('Erro ao verificar credenciais salvas:', error);
      } finally {
        setIsPageLoading(false);
      }
    };

    checkSavedCredentials();
  }, []);

  const handleAutoLogin = async (savedSiape: string, rememberToken: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('siape', savedSiape)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email: profile.email.toLowerCase(),
        password: rememberToken
      });

      if (loginError) throw loginError;

      toast({
        title: "Login automático realizado",
        description: `Bem-vindo de volta, ${profile.name}!`,
      });

      navigate('/nutricionista/dashboard');
    } catch (error) {
      console.error('Erro no login automático:', error);
      // Limpar credenciais salvas em caso de erro
      await supabase
        .from('saved_credentials')
        .delete()
        .match({ siape: savedSiape });
    }
  };

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

      // Se "Lembrar de mim" estiver marcado, salvar as credenciais
      if (rememberMe) {
        await supabase.from('saved_credentials').upsert({
          user_id: authData.user?.id,
          siape: siape,
          remember_token: password
        }, { onConflict: 'user_id' });
      }

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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Lembrar de mim
                </label>
              </div>

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
