
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
      <img
        src="/lovable-uploads/df75871b-6c80-4791-b3f8-c5a3ecd1f3d9.png"
        alt="Vamos Merendar Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
