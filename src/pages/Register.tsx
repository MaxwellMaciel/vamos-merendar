
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import StatusBar from '../components/StatusBar';
import { Mail, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    if (!name || !dob || !email || !password || !confirmPassword) {
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
    
    // Simulando um registro
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Vamos Merendar!",
      });
      navigate('/registration-success');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/login" label="Volta ao login" />
      </div>
      
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6 flex justify-center">
          <div className="bg-accent/30 p-3 rounded-lg shadow-sm">
            <User size={32} className="text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Criar conta
        </h1>
        
        <div className="w-full max-w-sm mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Nome*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-primary pl-10 w-full"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Calendar size={18} />
              </div>
              <input
                type="text"
                placeholder="Data de Nascimento* (DD/MM/AAAA)"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="input-primary pl-10 w-full"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="E-mail*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary pl-10 w-full"
                required
              />
            </div>
            
            <PasswordInput
              id="password"
              placeholder="Senha*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmar Senha*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <PasswordRequirements password={password} />
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-secondary font-medium hover:underline">
                Faça login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
