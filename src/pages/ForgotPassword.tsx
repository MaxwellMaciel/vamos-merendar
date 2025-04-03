import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Enviar email de recuperação de senha usando o Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique seu e-mail para redefinir sua senha. Se não encontrar, verifique sua caixa de spam.",
      });
      
      // Não redirecionamos imediatamente, deixamos o usuário ver a mensagem
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      setError(error.message || 'Ocorreu um erro ao enviar o email de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-accent w-20 h-20 rounded-lg flex items-center justify-center mb-6 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          Esqueceu sua senha?
        </h1>
        
        <p className="text-center text-gray-600 mb-6 max-w-xs">
          Digite abaixo o e-mail cadastrado para recuperar a senha:
        </p>
        
        <div className="w-full max-w-xs">
          {error && (
            <div className="mb-4 p-3 bg-[#f45b43]/10 border border-[#f45b43]/20 rounded-lg text-[#f45b43] text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary/10 border-0 rounded-lg p-3 pl-10 w-full text-black placeholder:text-gray-500 focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-1 text-sm mx-auto"
            >
              ← Voltar para login principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
