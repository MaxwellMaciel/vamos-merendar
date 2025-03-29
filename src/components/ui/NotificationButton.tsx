import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  className?: string;
}

const NotificationButton = ({ className = '' }: NotificationButtonProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Bell size={24} className="text-primary" />
    </div>
  );
};

export default NotificationButton; 