
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
      });
      
      navigate('/settings');
    } catch (error: any) {
      console.error('Error changing password:', error);
      setError(error.message || 'Ocorreu um erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
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
        
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Altere sua senha
        </h2>
        
        <div className="w-full max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="currentPassword"
              placeholder="Senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-gray-50"
            />
            
            <PasswordInput
              id="newPassword"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50"
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-50"
            />
            
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors mb-3"
              >
                {loading ? 'Alterando...' : 'Confirmar'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
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
