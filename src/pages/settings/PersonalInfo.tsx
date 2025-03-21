
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import { useToast } from '@/hooks/use-toast';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phoneEdited, setPhoneEdited] = useState(false);

  const handleSavePhone = () => {
    setPhoneEdited(true);
    
    setTimeout(() => {
      toast({
        title: "Telefone atualizado",
        description: "Seu telefone foi atualizado com sucesso!",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Dados Pessoais" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="space-y-4">
            <ProfileMenuItem
              label="Nome"
              value="Anna Maria"
              to="/settings/edit-name"
              color="secondary"
            />
            
            <ProfileMenuItem
              label="Telefone"
              value="(85) 9 8888-8888"
              to="/settings/edit-phone"
              color="secondary"
            />
            
            <ProfileMenuItem
              label="E-mail"
              value="anamaria@teste.com"
              to="/settings/edit-email"
              color="secondary"
            />
            
            {phoneEdited && (
              <div className="bg-accent text-accent-foreground p-3 rounded-lg text-center animate-in fade-in">
                Telefone alterado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
