
import React from 'react';
import Logo from './Logo';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        
        <p className="text-center text-sm text-gray-600 mt-2">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
