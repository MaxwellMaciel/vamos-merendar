
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import PasswordInput from '../../components/auth/PasswordInput';
import { useToast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulando a alteração de senha
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
      });
      navigate('/settings');
    }, 1000);
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
        <div className="w-full max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="currentPassword"
              placeholder="Senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-accent/50"
            />
            
            <PasswordInput
              id="newPassword"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-accent/50"
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-accent/50"
            />
            
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full mb-3"
              >
                {loading ? 'Alterando...' : 'Confirmar'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline w-full"
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
