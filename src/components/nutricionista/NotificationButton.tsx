import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationButton = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Link to="/nutricionista/notifications" className="relative">
      <Bell size={24} className="text-primary hover:text-primary/80 transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#f45b43] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationButton; 