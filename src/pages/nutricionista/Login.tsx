import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import PasswordInput from '../../components/auth/PasswordInput';
import { IdCard } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

const NutricionistaLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [siape, setSiape] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Garante que o SIAPE seja uma string
      const siapeString = String(siape).trim();
      console.log('Buscando perfil com SIAPE:', siapeString);
      
      // Primeiro busca o perfil pelo SIAPE
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('siape', siapeString)
        .eq('user_type', 'nutricionista')
        .single();

      console.log('Resultado da busca:', { profile, profileError });

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw new Error('SIAPE não encontrado');
      }

      if (!profile?.email) {
        throw new Error('Email não encontrado para este SIAPE');
      }

      console.log('Tentando login com:', { email: profile.email });

      // Faz login com o email associado ao SIAPE
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      console.log('Resultado do login:', { authData, authError });
      
      if (authError) {
        console.error('Erro na autenticação:', authError);
        throw new Error('Senha incorreta');
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo(a)!",
      });
      
      navigate('/nutricionista/dashboard');
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      setError(error.message || 'SIAPE ou senha inválidos.');
      toast({
        title: "Erro no login",
        description: error.message || "SIAPE ou senha inválidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Logo size="md" className="mb-6" />
        
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-center text-primary mb-6">
            Área do Nutricionista
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
                  onChange={(e) => setSiape(e.target.value.trim())}
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

export default NutricionistaLogin;
