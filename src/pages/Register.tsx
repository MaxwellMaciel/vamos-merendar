import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import StatusBar from '../components/StatusBar';
import { Mail, User, Calendar, IdCard, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import Loading from '../components/Loading';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [userType, setUserType] = useState<'aluno' | 'professor'>('aluno');

  useEffect(() => {
    // Simular carregamento da página
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);

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

  const validateAge = (dateString: string) => {
    // Converter a string DD/MM/AAAA para um objeto Date
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses em JS são 0-indexados
    const year = parseInt(parts[2], 10);
    
    const birthDate = new Date(year, month, day);
    
    // Verificar se a data é válida
    if (
      birthDate.getDate() !== day || 
      birthDate.getMonth() !== month || 
      birthDate.getFullYear() !== year
    ) {
      return false;
    }
    
    // Calcular idade
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Idade máxima permitida: 110 anos
    // Idade mínima razoável: 5 anos
    return age >= 5 && age <= 110;
  };

  const formatDateInput = (input: string) => {
    // Remove caracteres não numéricos
    const numbersOnly = input.replace(/\D/g, '');
    
    // Aplica a formatação DD/MM/AAAA
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateInput(e.target.value);
    setDob(formattedDate);
  };

  const formatPhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    
    if (numbersOnly.length <= 2) {
      return `(${numbersOnly}`;
    } else if (numbersOnly.length <= 6) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length <= 10) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
    } else {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const validatePhone = (phoneNumber: string) => {
    const numbersOnly = phoneNumber.replace(/\D/g, '');
    return numbersOnly.length >= 10 && numbersOnly.length <= 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !dob || !matricula || !email || !password || !confirmPassword || !phone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (!validateAge(dob)) {
      setError('Data de nascimento inválida. A idade deve estar entre 5 e 110 anos.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Número de telefone inválido. Digite um número válido com DDD.');
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            matricula: userType === 'aluno' ? matricula : null,
            siape: userType === 'professor' ? matricula : null,
            name,
            dob,
            phone,
            user_type: userType
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
              email,
              matricula: userType === 'aluno' ? matricula : null,
              siape: userType === 'professor' ? matricula : null,
              phone,
              user_type: userType
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

  if (isPageLoading) {
    return <Loading message="Carregando página de cadastro..." />;
  }

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
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-primary pl-10 w-full bg-[#fde2a1] shadow-md"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Calendar size={18} />
              </div>
              <input
                type="text"
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                value={dob}
                onChange={handleDateChange}
                maxLength={10}
                className="input-primary pl-10 w-full bg-[#fde2a1] shadow-md"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <IdCard size={18} />
              </div>
              <input
                type="text"
                placeholder={userType === 'aluno' ? "Matrícula" : "SIAPE"}
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="input-primary pl-10 w-full bg-[#fde2a1] shadow-md"
                required
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="aluno"
                  name="userType"
                  value="aluno"
                  checked={userType === 'aluno'}
                  onChange={(e) => setUserType(e.target.value as 'aluno')}
                  className="text-primary"
                />
                <label htmlFor="aluno" className="text-sm font-medium">Aluno</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="professor"
                  name="userType"
                  value="professor"
                  checked={userType === 'professor'}
                  onChange={(e) => setUserType(e.target.value as 'professor')}
                  className="text-primary"
                />
                <label htmlFor="professor" className="text-sm font-medium">Professor</label>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary pl-10 w-full bg-[#fde2a1] shadow-md"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                placeholder="Telefone (99) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={16}
                className="input-primary pl-10 w-full bg-[#fde2a1] shadow-md"
                required
              />
            </div>
            
            <PasswordInput
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#fde2a1] rounded-lg"
            />
            
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#fde2a1] rounded-lg"
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
                      <DialogContent className="max-w-xl rounded-xl border-0 shadow-lg bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl text-primary">Termos e Condições de Uso - Vamos Merendar</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto text-sm mt-4 space-y-4 px-2">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">1. Aceitação dos Termos</h3>
                            <p className="text-gray-700">
                              Ao utilizar o aplicativo "Vamos Merendar", você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar o aplicativo.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">2. Descrição do Serviço</h3>
                            <p className="text-gray-700">
                              O "Vamos Merendar" é um aplicativo destinado a alunos, nutricionistas e professores para gerenciamento e planejamento de refeições escolares.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">3. Cadastro e Segurança</h3>
                            <p className="text-gray-700">
                              Ao se cadastrar, você concorda em fornecer informações verdadeiras, precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">4. Uso de Dados Pessoais</h3>
                            <p className="text-gray-700">
                              Coletamos informações pessoais apenas para fins específicos, como criar perfis de usuário e gerenciar serviços. Seus dados não serão compartilhados com terceiros sem seu consentimento.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">5. Regras de Conduta</h3>
                            <p className="text-gray-700">
                              Você concorda em não usar o aplicativo para fins ilegais ou não autorizados. Qualquer uso inadequado resultará no encerramento de sua conta.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">6. Propriedade Intelectual</h3>
                            <p className="text-gray-700">
                              Todo o conteúdo no aplicativo "Vamos Merendar" é protegido por direitos autorais e outras leis de propriedade intelectual.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">7. Limitação de Responsabilidade</h3>
                            <p className="text-gray-700">
                              O aplicativo é fornecido "como está" e não garantimos que ele atenderá a todos os requisitos do usuário ou que funcionará sem interrupções.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">8. Alterações nos Termos</h3>
                            <p className="text-gray-700">
                              Podemos modificar estes Termos a qualquer momento. É sua responsabilidade verificar periodicamente se houve alterações.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">9. Lei Aplicável</h3>
                            <p className="text-gray-700">
                              Estes Termos serão regidos e interpretados de acordo com as leis do Brasil.
                            </p>
                          </div>
                          
                          <div className="text-center p-4 bg-primary/10 rounded-lg mt-4">
                            <p className="font-medium text-primary">
                              Ao usar o aplicativo "Vamos Merendar", você reconhece que leu, entendeu e concorda com estes Termos e Condições de Uso.
                            </p>
                          </div>
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
                      <DialogContent className="max-w-xl rounded-xl border-0 shadow-lg bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl text-primary">Política de Privacidade - Vamos Merendar</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto text-sm mt-4 space-y-4 px-2">
                          <p className="bg-gray-50 p-4 rounded-lg text-gray-700">
                            Esta Política de Privacidade descreve como o aplicativo "Vamos Merendar" coleta, usa e compartilha suas informações pessoais.
                          </p>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">1. Informações que Coletamos</h3>
                            <p className="text-gray-700 mb-2">
                              Coletamos as seguintes informações:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                              <li>Informações de cadastro: nome, e-mail, matrícula, data de nascimento</li>
                              <li>Restrições alimentares</li>
                              <li>Preferências de refeição</li>
                              <li>Feedback sobre as refeições</li>
                              <li>Dados de uso do aplicativo</li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">2. Como Usamos suas Informações</h3>
                            <p className="text-gray-700 mb-2">
                              Utilizamos suas informações para:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                              <li>Fornecer e melhorar nossos serviços</li>
                              <li>Personalizar sua experiência com base em restrições alimentares</li>
                              <li>Comunicar informações sobre refeições e cardápios</li>
                              <li>Analisar tendências e comportamentos de uso</li>
                              <li>Garantir a segurança de nossos serviços</li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">3. Compartilhamento de Informações</h3>
                            <p className="text-gray-700 mb-2">
                              Não compartilhamos suas informações pessoais com terceiros, exceto:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                              <li>Com seu consentimento explícito</li>
                              <li>Com nutricionistas e administradores escolares (apenas dados sobre restrições alimentares)</li>
                              <li>Quando exigido por lei</li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">4. Segurança</h3>
                            <p className="text-gray-700">
                              Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado ou alteração.
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">5. Seus Direitos</h3>
                            <p className="text-gray-700 mb-2">
                              Você tem o direito de:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                              <li>Acessar seus dados pessoais</li>
                              <li>Solicitar a correção de dados imprecisos</li>
                              <li>Solicitar a exclusão de seus dados</li>
                              <li>Retirar seu consentimento a qualquer momento</li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-primary mb-2">6. Alterações a esta Política</h3>
                            <p className="text-gray-700">
                              Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas.
                            </p>
                          </div>
                          
                          <div className="text-center p-4 bg-primary/10 rounded-lg mt-4">
                            <p className="font-medium text-primary">
                              Ao usar o aplicativo "Vamos Merendar", você concorda com esta Política de Privacidade.
                            </p>
                          </div>
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
                className="w-full bg-[#f45b43] hover:bg-[#f45b43]/90 text-white py-3 px-4 rounded-lg font-medium transition-all"
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-[#f45b43] font-medium hover:underline">
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
