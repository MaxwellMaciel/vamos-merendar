import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton = ({ to, label, className = "" }: BackButtonProps) => {
  return (
    <div className="flex items-center">
      <Link to={to} className={`flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${className}`}>
        <ChevronLeft className="h-6 w-6" />
        {label && <span className="font-medium">{label}</span>}
      </Link>
    </div>
  );
};

export default BackButton;
