
import React from 'react';
import { Progress } from '@/components/ui/progress';
import Logo from './Logo';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-24 h-24 mb-8">
        <Logo size="lg" />
      </div>
      
      <div className="w-full max-w-xs">
        <Progress value={progress} className="h-2 mb-4 bg-gray-200" />
        <p className="text-center text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
