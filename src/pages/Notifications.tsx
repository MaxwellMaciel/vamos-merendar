
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import { useNotifications } from '../contexts/NotificationContext';
import { MapPin, Bell, Book, Calendar, Edit, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    // Mark notifications as read when viewed on this page
    const timer = setTimeout(() => {
      if (notifications.some(n => !n.read)) {
        markAllAsRead();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notifications, markAllAsRead]);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // In a real app, you might navigate to a specific screen based on the notification type
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <MapPin size={20} className="text-accent" />;
      case 'class':
        return <Bell size={20} className="text-accent" />;
      case 'menu':
        return <Book size={20} className="text-accent" />;
      case 'register':
        return <Edit size={20} className="text-accent" />;
      case 'complete':
        return <Check size={20} className="text-accent" />;
      default:
        return <Bell size={20} className="text-accent" />;
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/" label="Notificações" />
      </div>
      
      {notifications.length > 0 ? (
        <>
          <div className="px-4 py-2 flex justify-end">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary font-medium dark:text-primary-foreground"
            >
              Marcar todas como lidas
            </button>
          </div>
          
          <div className="flex-1 divide-y dark:divide-gray-800">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 flex items-start cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                  !notification.read && "bg-gray-50 dark:bg-gray-800/50"
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="mr-3 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary dark:text-secondary-foreground">{notification.title}</h3>
                  <p className="text-sm text-amber-500 mb-1">{formatDate(notification.date)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Bell size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">Sem notificações</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            Você não tem notificações no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
