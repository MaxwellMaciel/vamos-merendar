import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <img
          src="/lovable-uploads/Logo.png"
          alt="Vamos Merendar Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
