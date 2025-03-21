
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center text-primary hover:text-primary-dark transition-colors py-2"
    >
      <ChevronLeft size={20} />
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
};

export default BackButton;
