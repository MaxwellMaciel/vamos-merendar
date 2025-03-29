import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './button';

interface ThemeButtonProps {
  className?: string;
}

const ThemeButton = ({ className = '' }: ThemeButtonProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
    >
      {isDarkMode ? (
        <Sun size={24} className="text-primary" />
      ) : (
        <Moon size={24} className="text-primary" />
      )}
    </Button>
  );
};

export default ThemeButton; 