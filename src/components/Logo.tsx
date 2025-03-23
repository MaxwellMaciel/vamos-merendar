
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full border-4 border-primary animate-in fade-in duration-300"></div>
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <img
          src="/lovable-uploads/d9e00eab-af0e-454c-a33d-71d76462ffd9.png"
          alt="Vamos Merendar Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
