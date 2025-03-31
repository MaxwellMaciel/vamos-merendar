import React from 'react';
import { Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MealCardProps {
  title: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  className?: string;
}

const MealCard: React.FC<MealCardProps> = ({ title, description, type, className }) => {
  const getTime = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '09:30 - 09:40';
      case 'lunch':
        return '11:40 - 12:10';
      case 'dinner':
        return '15:00 - 15:10';
      default:
        return '';
    }
  };

  return (
    <div className={cn("mb-3 animate-in fade-in bg-white/10 rounded-lg p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Utensils size={20} className="text-white" />
          <h3 className="text-white font-medium text-base lg:text-lg">{title}</h3>
        </div>
        <span className="text-white/80 text-xs">{getTime(type)}</span>
      </div>
      <p className="text-white/90 text-sm lg:text-base ml-8">{description}</p>
    </div>
  );
};

export default MealCard;
