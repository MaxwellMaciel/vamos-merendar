import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProfile } from '@/hooks/use-profile';

interface NotificationButtonProps {
  className?: string;
}

const NotificationButton = ({ className = '' }: NotificationButtonProps) => {
  const { unreadCount } = useNotifications();
  const { profile } = useProfile();

  const getNotificationPath = () => {
    switch (profile?.user_type) {
      case 'aluno':
        return '/aluno/notifications';
      case 'nutricionista':
        return '/nutricionista/notifications';
      default:
        return '/notifications';
    }
  };

  return (
    <Link to={getNotificationPath()} className={`relative flex items-center ${className}`}>
      <Bell size={24} className="text-primary hover:text-primary/80 transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#f45b43] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationButton; 