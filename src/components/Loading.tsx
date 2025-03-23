
import React from 'react';
import Logo from './Logo';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-24 h-24 mb-10">
        <Logo size="lg" />
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-center text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
