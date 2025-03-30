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
  return (
    <div className={cn("mb-3 animate-in fade-in bg-white/10 rounded-lg p-3", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Utensils size={20} className="text-white" />
        <h3 className="text-white font-medium text-base lg:text-lg">{title}</h3>
      </div>
      <p className="text-white/90 text-sm lg:text-base ml-8">{description}</p>
    </div>
  );
};

export default MealCard;
