
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import PasswordInput from '../../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';

const ProfessorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [siape, setSiape] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!siape || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    // Simulando uma autenticação para professor
    setTimeout(() => {
      setLoading(false);
      
      // Credenciais fixas para professor
      if (siape === '54321' && password === 'Professor@123') {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo(a) de volta ao Vamos Merendar!",
        });
        navigate('/professor/dashboard');
      } else {
        setError('SIAPE ou senha inválidos.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/login" label="Voltar para login" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-primary mb-6">
            Login de Professor(a)
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
          
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorLogin;
