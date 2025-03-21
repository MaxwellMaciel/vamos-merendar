
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import StatusBar from '../components/StatusBar';
import { Mail, User, Calendar, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    
    if (!name || !dob || !matricula || !email || !password || !confirmPassword) {
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
    
    if (!acceptTerms) {
      setError('Você deve aceitar os termos de uso para continuar.');
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
                <IdCard size={18} />
              </div>
              <input
                type="text"
                placeholder="Matrícula*"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <div className="text-sm">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito os{' '}
                  <Dialog>
                    <DialogTrigger className="text-primary underline">
                      termos de uso
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Termos de Uso - Vamos Merendar</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto text-sm">
                        <h3 className="font-bold mt-4 mb-2">1. Aceitação dos Termos</h3>
                        <p className="mb-2">
                          Ao utilizar o aplicativo "Vamos Merendar", você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar o aplicativo.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">2. Descrição do Serviço</h3>
                        <p className="mb-2">
                          O "Vamos Merendar" é um aplicativo destinado a alunos, nutricionistas e professores para gerenciamento e planejamento de refeições escolares.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">3. Cadastro e Segurança</h3>
                        <p className="mb-2">
                          Ao se cadastrar, você concorda em fornecer informações verdadeiras, precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">4. Uso de Dados Pessoais</h3>
                        <p className="mb-2">
                          Coletamos informações pessoais apenas para fins específicos, como criar perfis de usuário e gerenciar serviços. Seus dados não serão compartilhados com terceiros sem seu consentimento.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">5. Regras de Conduta</h3>
                        <p className="mb-2">
                          Você concorda em não usar o aplicativo para fins ilegais ou não autorizados. Qualquer uso inadequado resultará no encerramento de sua conta.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">6. Propriedade Intelectual</h3>
                        <p className="mb-2">
                          Todo o conteúdo no aplicativo "Vamos Merendar" é protegido por direitos autorais e outras leis de propriedade intelectual.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">7. Limitação de Responsabilidade</h3>
                        <p className="mb-2">
                          O aplicativo é fornecido "como está" e não garantimos que ele atenderá a todos os requisitos do usuário ou que funcionará sem interrupções.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">8. Alterações nos Termos</h3>
                        <p className="mb-2">
                          Podemos modificar estes Termos a qualquer momento. É sua responsabilidade verificar periodicamente se houve alterações.
                        </p>
                        
                        <h3 className="font-bold mt-4 mb-2">9. Lei Aplicável</h3>
                        <p className="mb-2">
                          Estes Termos serão regidos e interpretados de acordo com as leis do Brasil.
                        </p>
                        
                        <p className="mt-4">
                          Ao usar o aplicativo "Vamos Merendar", você reconhece que leu, entendeu e concorda com estes Termos de Uso.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>
            </div>
            
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
