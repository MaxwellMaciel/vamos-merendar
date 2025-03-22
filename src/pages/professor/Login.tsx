
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import PasswordInput from '../../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../../components/Loading';

const ProfessorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [siape, setSiape] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Simular carregamento da página
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
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
      // Modo de teste para facilitar o desenvolvimento
      if (siape === 'professor' && password === 'professor123') {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo(a), Professor(a)!",
        });
        navigate('/professor/dashboard');
        return;
      }
      
      // Tentar autenticar usando o SIAPE diretamente
      const { data, error } = await supabase.auth.signInWithPassword({
        email: siape,
        password,
      });
      
      if (error) throw error;
      
      // Verificar se é professor
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, name')
        .eq('user_id', data.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profileData.user_type !== 'professor') {
        throw new Error('Este usuário não tem perfil de professor.');
      }
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a), Professor(a) ${profileData.name ? profileData.name.split(' ')[0] : ''}!`,
      });
      
      navigate('/professor/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('SIAPE ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return <Loading message="Carregando página de login de professor..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-center text-primary mb-6">
            Área do Professor
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm animate-in fade-in">
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
                  className="input-primary pl-10 w-full"
                />
              </div>
            </div>
            
            <PasswordInput
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-primary hover:underline"
            >
              ← Voltar para login principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorLogin;
