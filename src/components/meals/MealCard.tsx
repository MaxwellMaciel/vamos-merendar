
import React from 'react';
import { Utensils } from 'lucide-react';

interface MealCardProps {
  title: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner';
}

const MealCard: React.FC<MealCardProps> = ({ title, description, type }) => {
  return (
    <div className="mb-3 animate-in fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Utensils size={16} className="text-white" />
        <h3 className="text-white font-medium">{title}:</h3>
      </div>
      <p className="text-white/80 text-sm ml-6">{description}</p>
    </div>
  );
};

export default MealCard;
