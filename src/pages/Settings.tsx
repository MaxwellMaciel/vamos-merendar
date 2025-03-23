
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import { LockKeyhole, User, LogOut, Shield, Coffee, Info, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userType, setUserType] = useState<string>('aluno');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, email, user_type')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setUserName(data.name || '');
            setUserEmail(data.email || user.email || '');
            setUserType(data.user_type || 'aluno');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sair da conta.",
        variant: "destructive",
      });
    }
  };

  // Determine dashboard route based on user type
  const getDashboardRoute = () => {
    return `/${userType}/dashboard`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-transition">
      <StatusBar />
      
      <div className="p-4 bg-white border-b border-gray-200">
        <BackButton to={getDashboardRoute()} />
      </div>
      
      <div className="bg-primary p-6 text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{loading ? 'Carregando...' : userName}</h2>
            <p className="text-white/80">{loading ? '' : userEmail}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <h3 className="p-4 text-sm font-medium text-gray-500 uppercase border-b border-gray-100">
            Sua Conta
          </h3>
          
          <ProfileMenuItem
            label="Dados Pessoais"
            to="/settings/personal"
            icon={<User size={18} className="text-primary" />}
          />
          
          <ProfileMenuItem
            label="Alterar Senha"
            to="/settings/password"
            icon={<LockKeyhole size={18} className="text-primary" />}
          />
          
          <ProfileMenuItem
            label="Restrições Alimentares"
            to="/settings/restrictions"
            icon={<Coffee size={18} className="text-primary" />}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <h3 className="p-4 text-sm font-medium text-gray-500 uppercase border-b border-gray-100">
            Informações
          </h3>
          
          <ProfileMenuItem
            label="Sobre o Aplicativo"
            to="/about"
            icon={<Info size={18} className="text-primary" />}
          />
          
          <ProfileMenuItem
            label="Ajuda e Suporte"
            to="/help"
            icon={<HelpCircle size={18} className="text-primary" />}
          />
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-white border border-red-500 text-red-500 font-medium py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
