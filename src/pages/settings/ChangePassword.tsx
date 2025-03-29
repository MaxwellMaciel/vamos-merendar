import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import PasswordInput from '../../components/auth/PasswordInput';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LockKeyhole } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação dos campos
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (currentPassword === newPassword) {
      setError('A nova senha deve ser diferente da senha atual.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Primeiro, verificar a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword
      });

      if (signInError) {
        setError('Senha atual incorreta.');
        return;
      }

      // Se a senha atual estiver correta, atualizar para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
        variant: "default"
      });
      
      // Limpar os campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      navigate('/settings');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      // Tratamento de erros específicos
      if (error.message.includes('auth')) {
        setError('Erro de autenticação. Por favor, tente novamente.');
      } else {
        setError('Ocorreu um erro ao alterar a senha. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Alterar senha" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <LockKeyhole size={36} className="text-primary" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6 text-[#244b2c]">
          Altere sua senha
        </h2>
        
        <div className="w-full max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="currentPassword"
              placeholder="Senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white/30 shadow-md"
            />
            
            <PasswordInput
              id="newPassword"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/30 shadow-md"
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/30 shadow-md"
            />
            
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Alterando...' : 'Confirmar'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="w-full border border-border text-foreground font-medium py-3 rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
