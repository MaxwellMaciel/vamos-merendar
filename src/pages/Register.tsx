
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import StatusBar from '../components/StatusBar';
import { Mail, User, Calendar, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

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
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  useEffect(() => {
    if (password) {
      const hasMinLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      
      setShowPasswordRequirements(!(hasMinLength && hasUpperCase && (hasSpecialChar || hasNumber)));
    } else {
      setShowPasswordRequirements(false);
    }
  }, [password]);

  const validatePassword = () => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasMinLength && hasUpperCase && (hasSpecialChar || hasNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    if (!acceptTerms || !acceptPrivacy) {
      setError('Você deve aceitar os termos de uso e política de privacidade para continuar.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Criar email padrão com base na matrícula para login
      const userEmail = `${matricula}@example.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            matricula,
            name,
            dob
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        navigate('/dietary-restrictions', { 
          state: { 
            userId: data.user.id,
            userData: {
              name,
              email: userEmail, // Usando o email gerado com a matrícula
              matricula
            }
          } 
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Ocorreu um erro durante o cadastro.');
    } finally {
      setLoading(false);
    }
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
            
            <PasswordRequirements password={password} show={showPasswordRequirements} />
            
            <div className="space-y-2">
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
                      <DialogTrigger className="text-primary underline font-medium">
                        Termos e Condições de Uso
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Termos e Condições de Uso - Vamos Merendar</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto text-sm mt-4">
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
                          
                          <p className="mt-6 mb-2 text-center font-medium">
                            Ao usar o aplicativo "Vamos Merendar", você reconhece que leu, entendeu e concorda com estes Termos e Condições de Uso.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={acceptPrivacy}
                  onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                />
                <div className="text-sm">
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito a{' '}
                    <Dialog>
                      <DialogTrigger className="text-primary underline font-medium">
                        Política de Privacidade
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Política de Privacidade - Vamos Merendar</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto text-sm mt-4">
                          <p className="mb-4">
                            Esta Política de Privacidade descreve como o aplicativo "Vamos Merendar" coleta, usa e compartilha suas informações pessoais.
                          </p>
                          
                          <h3 className="font-bold mt-4 mb-2">1. Informações que Coletamos</h3>
                          <p className="mb-2">
                            Coletamos as seguintes informações:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Informações de cadastro: nome, e-mail, matrícula, data de nascimento</li>
                            <li>Restrições alimentares</li>
                            <li>Preferências de refeição</li>
                            <li>Feedback sobre as refeições</li>
                            <li>Dados de uso do aplicativo</li>
                          </ul>
                          
                          <h3 className="font-bold mt-4 mb-2">2. Como Usamos suas Informações</h3>
                          <p className="mb-2">
                            Utilizamos suas informações para:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Fornecer e melhorar nossos serviços</li>
                            <li>Personalizar sua experiência com base em restrições alimentares</li>
                            <li>Comunicar informações sobre refeições e cardápios</li>
                            <li>Analisar tendências e comportamentos de uso</li>
                            <li>Garantir a segurança de nossos serviços</li>
                          </ul>
                          
                          <h3 className="font-bold mt-4 mb-2">3. Compartilhamento de Informações</h3>
                          <p className="mb-2">
                            Não compartilhamos suas informações pessoais com terceiros, exceto:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Com seu consentimento explícito</li>
                            <li>Com nutricionistas e administradores escolares (apenas dados sobre restrições alimentares)</li>
                            <li>Quando exigido por lei</li>
                          </ul>
                          
                          <h3 className="font-bold mt-4 mb-2">4. Segurança</h3>
                          <p className="mb-2">
                            Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado ou alteração.
                          </p>
                          
                          <h3 className="font-bold mt-4 mb-2">5. Seus Direitos</h3>
                          <p className="mb-2">
                            Você tem o direito de:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Acessar seus dados pessoais</li>
                            <li>Solicitar a correção de dados imprecisos</li>
                            <li>Solicitar a exclusão de seus dados</li>
                            <li>Retirar seu consentimento a qualquer momento</li>
                          </ul>
                          
                          <h3 className="font-bold mt-4 mb-2">6. Alterações a esta Política</h3>
                          <p className="mb-2">
                            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas.
                          </p>
                          
                          <p className="mt-6 mb-2 text-center font-medium">
                            Ao usar o aplicativo "Vamos Merendar", você concorda com esta Política de Privacidade.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </label>
                </div>
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
