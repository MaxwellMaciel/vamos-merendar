
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import PasswordInput from '../components/auth/PasswordInput';
import { Mail } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    // Simulando uma autenticação
    setTimeout(() => {
      setLoading(false);
      
      // Simulação de login bem-sucedido para aluno
      if (email.includes('@') && password.length >= 6) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta ao Vamos Merendar!",
        });
        navigate('/aluno/dashboard');
      } else {
        setError('Email ou senha inválidos.');
      }
    }, 1000);
  };

  const handleRoleSelection = (role: string) => {
    if (role === 'aluno') {
      navigate('/aluno/dashboard');
    } else if (role === 'nutricionista') {
      navigate('/nutricionista/dashboard');
    } else if (role === 'professor') {
      navigate('/professor/dashboard');
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
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRoleSelection('aluno')}
              className="btn-outline text-center text-sm py-2"
            >
              Aluno(a)
            </button>
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
