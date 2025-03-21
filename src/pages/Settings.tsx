
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import { LockKeyhole, User, LogOut, Shield } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de logout aqui
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-transition">
      <StatusBar />
      
      <div className="p-4 bg-white border-b border-gray-200">
        <BackButton to="/aluno/dashboard" />
      </div>
      
      <div className="flex items-center justify-between p-6 bg-white mb-4 shadow-sm">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium">Aluno(a)</h2>
            <p className="text-sm text-gray-500">aluno@example.com</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <h3 className="p-4 text-sm font-medium text-gray-500 uppercase">Conta</h3>
        
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
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <h3 className="p-4 text-sm font-medium text-gray-500 uppercase">Legal</h3>
        
        <ProfileMenuItem
          label="Políticas de Privacidade"
          to="/settings/privacy"
          icon={<Shield size={18} className="text-primary" />}
        />
      </div>
      
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span className="font-medium">Sair da conta</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
