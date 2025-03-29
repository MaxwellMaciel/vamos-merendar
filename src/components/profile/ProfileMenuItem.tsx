import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileMenuItemProps {
  label: string;
  value?: string;
  to: string;
  color?: 'default' | 'primary' | 'secondary';
  icon?: React.ReactNode;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  value,
  to,
  color = 'default',
  icon,
}) => {
  const textColors = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
  };

  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 border-b border-border hover:bg-muted/50 transition-colors animate-in fade-in"
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span className={textColors[color]}>{label}</span>
      </div>
      <div className="flex items-center">
        {value && <span className="text-muted-foreground mr-1">{value}</span>}
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    </Link>
  );
};

export default ProfileMenuItem;
