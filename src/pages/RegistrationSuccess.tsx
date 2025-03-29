import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { CheckCircle, X } from 'lucide-react';
import StatusBar from '../components/StatusBar';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>
        
        <Logo size="sm" className="mb-4" />
        
        <div className="flex items-center justify-center w-16 h-16 mb-4">
          <CheckCircle size={48} className="text-primary" />
        </div>
        
        <h1 className="text-xl font-bold text-center mb-2">
          Sua conta foi confirmada com sucesso!
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Sua conta foi confirmada com sucesso!
        </p>
        
        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-xs bg-[#f45b43] hover:bg-[#f45b43]/90 text-white py-3 px-4 rounded-lg font-medium transition-all"
        >
          Voltar para o cadastro
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
