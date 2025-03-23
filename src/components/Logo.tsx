
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
        src="/lovable-uploads/32a8ef0f-0cd1-48d7-a2a8-4b8d42a68a23.png"
        alt="Vamos Merendar Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
