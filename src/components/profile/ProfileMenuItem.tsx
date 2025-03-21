
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
    default: 'text-gray-800',
    primary: 'text-primary',
    secondary: 'text-secondary',
  };

  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors animate-in fade-in"
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span className={textColors[color]}>{label}</span>
      </div>
      <div className="flex items-center">
        {value && <span className="text-gray-500 mr-1">{value}</span>}
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </Link>
  );
};

export default ProfileMenuItem;
