import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import { LockKeyhole, User, LogOut, Shield, Coffee, Info, HelpCircle, Calendar, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/use-profile';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Loading from '@/components/Loading';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading } = useProfile();
  const isNutricionista = profile?.user_type === 'nutricionista';

  const getDashboardPath = () => {
    if (loading || !profile) return '/aluno/dashboard';
    
    switch (profile.user_type) {
      case 'nutricionista':
        return '/nutricionista/dashboard';
      default:
        return '/aluno/dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loading message="Carregando configurações..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StatusBar />
      
      <div className="px-4 -mt-4">
        <BackButton 
          to={getDashboardPath()}
          className="text-primary" 
        />
      </div>

      <div className="px-4 w-full max-w-7xl mx-auto mt-2">
        <div className="bg-primary rounded-[32px] text-primary-foreground relative overflow-hidden shadow-lg -mt-2">
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5" />
          
          <div className="relative px-8 py-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  {profile?.profile_image ? (
                    <AvatarImage 
                      src={profile.profile_image} 
                      alt="Profile" 
                      className="object-cover rounded-2xl"
                      onError={(e) => {
                        console.error('Error loading profile image:', e);
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '';
                      }}
                    />
                  ) : (
                    <AvatarFallback className="bg-white/5 rounded-2xl">
                      <User size={40} className="text-primary-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-9 md:h-9 bg-[#244b2c] rounded-full flex items-center justify-center ring-2 ring-white">
                  <User size={14} className="text-white md:w-5 md:h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-white truncate">
                  {loading ? 'Carregando...' : profile?.name || 'Nome não disponível'}
                </h2>
                <div className="space-y-1 text-emerald-50/90">
                  <p className="flex items-center text-sm md:text-base font-medium">
                    <span className="truncate">
                      {loading ? '' : 
                        profile?.user_type === 'aluno' ? 
                          (profile?.matricula || 'Matrícula não disponível') : 
                          (profile?.siape || 'SIAPE não disponível')}
                    </span>
                  </p>
                  <p className="flex items-center text-sm md:text-base font-medium truncate">
                    {loading ? '' : profile?.email || 'Email não disponível'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-card text-card-foreground rounded-2xl shadow-lg mb-4 overflow-hidden">
            <h3 className="p-4 md:p-6 text-sm md:text-base font-medium text-muted-foreground uppercase border-b border-border">
              Sua Conta
            </h3>
            
            <ProfileMenuItem
              label="Dados Pessoais"
              to="/settings/personal"
              icon={<User size={18} className="text-primary md:w-6 md:h-6" />}
            />
            
            <ProfileMenuItem
              label="Alterar Senha"
              to="/settings/password"
              icon={<LockKeyhole size={18} className="text-primary md:w-6 md:h-6" />}
            />
            
            <ProfileMenuItem
              label="Restrições Alimentares"
              to="/settings/dietary-restrictions"
              icon={<Coffee size={18} className="text-primary md:w-6 md:h-6" />}
            />

            <ProfileMenuItem
              label="Tema"
              to="/settings/theme"
              icon={<Palette size={18} className="text-primary md:w-6 md:h-6" />}
            />
          </div>
          
          <div className="bg-card text-card-foreground rounded-2xl shadow-lg mb-4 overflow-hidden">
            <h3 className="p-4 md:p-6 text-sm md:text-base font-medium text-muted-foreground uppercase border-b border-border">
              Informações
            </h3>
            
            <ProfileMenuItem
              label="Sobre o Aplicativo"
              to="/about"
              icon={<Info size={18} className="text-primary md:w-6 md:h-6" />}
            />
            
            <ProfileMenuItem
              label="Ajuda e Suporte"
              to="/help"
              icon={<HelpCircle size={18} className="text-primary md:w-6 md:h-6" />}
            />
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-card border border-[#f45b43] text-[#f45b43] font-medium py-3 md:py-4 rounded-lg hover:bg-[#f45b43]/10 transition-colors flex items-center justify-center text-sm md:text-base"
          >
            <LogOut size={18} className="mr-2 md:w-6 md:h-6" />
            <span>Sair da conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
