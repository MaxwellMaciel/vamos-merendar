
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import PasswordInput from '../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!matricula || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar se é um login simulado para desenvolvimento
      if (matricula === 'aluno' && password === 'aluno123') {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta ao Vamos Merendar!",
        });
        navigate('/aluno/dashboard');
        return;
      }
      
      // Construir o email usando a matrícula para autenticação
      // Corrigindo o problema de login usando o email formado com a matrícula
      const email = `${matricula}@example.com`;
      console.log("Tentando login com email:", email);
      
      // Tentar autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) throw error;
      
      // Obter o tipo de usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_type, name')
        .eq('user_id', data.user.id)
        .single();
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileData?.name || 'Usuário'}!`,
      });
      
      // Redirecionar com base no tipo de usuário
      if (profileData?.user_type === 'aluno') {
        navigate('/aluno/dashboard');
      } else if (profileData?.user_type === 'professor') {
        navigate('/professor/dashboard');
      } else if (profileData?.user_type === 'nutricionista') {
        navigate('/nutricionista/dashboard');
      } else {
        navigate('/aluno/dashboard'); // Fallback
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Matrícula/SIAPE ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (role: string) => {
    if (role === 'nutricionista') {
      navigate('/nutricionista/login');
    } else if (role === 'professor') {
      navigate('/professor/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
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
                  placeholder="Matrícula/SIAPE"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
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
          
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="px-4 text-sm text-gray-500">ou entre como</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRoleSelection('nutricionista')}
              className="btn-outline text-center text-sm py-2"
            >
              Nutricionista
            </button>
            <button
              onClick={() => handleRoleSelection('professor')}
              className="btn-outline text-center text-sm py-2"
            >
              Professor(a)
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-secondary font-medium hover:underline">
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
