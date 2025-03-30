import React from 'react';
import { MapPin, Bell, Book, Calendar, Edit, Check, UtensilsCrossed } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'attendance' | 'class' | 'menu' | 'register' | 'complete' | 'meal_attendance';
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onNotificationClick,
  onClose
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'attendance':
        return <MapPin className="text-secondary" />;
      case 'class':
        return <Bell className="text-secondary" />;
      case 'menu':
        return <Book className="text-secondary" />;
      case 'register':
        return <Edit className="text-secondary" />;
      case 'complete':
        return <Check className="text-secondary" />;
      case 'meal_attendance':
        return <UtensilsCrossed className="text-secondary" />;
      default:
        return <Bell className="text-secondary" />;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return 'Hoje ' + format(date, 'HH:mm', { locale: ptBR });
    }
    
    return format(date, "d 'de' MMMM HH:mm", { locale: ptBR });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-white h-full overflow-auto animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b p-4 sticky top-0 bg-white z-10">
          <button 
            onClick={onClose}
            className="mr-4 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h2 className="text-xl font-medium text-primary">Notificações</h2>
        </div>
        
        <div className="divide-y">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 flex items-start cursor-pointer transition-colors hover:bg-gray-50",
                  !notification.read && "bg-gray-50"
                )}
                onClick={() => onNotificationClick && onNotificationClick(notification)}
              >
                <div className="mr-3 mt-1 w-6 h-6 flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary">{notification.title}</h3>
                  <p className="text-sm text-amber-500 mb-1">{formatDate(notification.date)}</p>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Não há mais notificações</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
