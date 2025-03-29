import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PasswordInput from '../components/auth/PasswordInput';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar se o usuário tem acesso a esta página
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Acesso negado",
          description: "O link de redefinição de senha é inválido ou expirou.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate, toast]);

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasMinLength && hasUpperCase && (hasSpecialChar || hasNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número ou caractere especial.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso. Você já pode fazer login.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      setError(error.message || 'Ocorreu um erro ao atualizar sua senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-accent w-20 h-20 rounded-lg flex items-center justify-center mb-6 shadow-sm">
          <Lock size={32} className="text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          Redefinir senha
        </h1>
        
        <p className="text-center text-gray-600 mb-6 max-w-xs">
          Digite sua nova senha abaixo:
        </p>
        
        <div className="w-full max-w-xs">
          {error && (
            <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Atualizando...' : 'Atualizar senha'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-1 text-sm mx-auto"
            >
              ← Voltar para login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
