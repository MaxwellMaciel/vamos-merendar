
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';

const Privacy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleConfirm = () => {
    if (!privacyAccepted || !termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Por favor, aceite os termos para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Termos aceitos",
      description: "Obrigado por aceitar nossos termos e condições.",
    });
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="bg-secondary w-20 h-20 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            Políticas de Privacidade
          </h1>
          
          <p className="mb-6 text-gray-700">
            Para utilizar o aplicativo, você deve ler e aceitar a Política de Privacidade e os
            Termos e Condições de Uso:
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label htmlFor="privacy" className="flex items-center">
                <span>Ler mais sobre</span>
                <span className="ml-1 text-secondary font-medium">Política de Privacidade</span>
              </label>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={() => setPrivacyAccepted(!privacyAccepted)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label htmlFor="terms" className="flex items-center">
                <span>Ler mais sobre</span>
                <span className="ml-1 text-secondary font-medium">Termos e Condições de Uso</span>
              </label>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          
          <button
            onClick={handleConfirm}
            className="btn-primary w-full"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
