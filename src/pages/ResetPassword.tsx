
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import StatusBar from '../components/StatusBar';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validatePassword = () => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasMinLength && hasUpperCase && (hasSpecialChar || hasNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (!validatePassword()) {
      setError('Sua senha não atende aos requisitos de segurança.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    
    // Simulando a alteração de senha
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Senha redefinida",
        description: "Sua senha foi alterada com sucesso!",
      });
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/login" label="Volta ao login" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-primary w-20 h-20 rounded-lg flex items-center justify-center mb-6 shadow-sm">
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
            className="text-white"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          Redefinição de senha
        </h1>
        
        <p className="text-center text-gray-600 mb-6 max-w-xs">
          Digite abaixo uma nova senha de acesso:
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
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowPasswordRequirements(true);
              }}
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirma Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <PasswordRequirements password={password} show={showPasswordRequirements} />
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full"
              >
                {loading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
