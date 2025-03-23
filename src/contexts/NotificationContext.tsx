
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Notification } from '../components/NotificationPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  toggleNotifications: () => void;
  closeNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Example notifications for demonstration
  useEffect(() => {
    // In a real app, you would fetch these from your API or database
    const demoNotifications: Notification[] = [
      {
        id: '1',
        title: 'Comparecerá ao campus hoje?',
        description: 'Responda o bloco de pergunta na página inicial para um melhor gerenciamento',
        date: new Date(),
        type: 'attendance',
        read: false
      },
      {
        id: '2',
        title: 'Aula Programada',
        description: 'Você tem uma aula de reposição',
        date: new Date(Date.now() - 3600000), // 1 hour ago
        type: 'class',
        read: false
      },
      {
        id: '3',
        title: 'Cardápio do dia',
        description: 'Veja a refeição do dia',
        date: new Date(Date.now() - 7200000), // 2 hours ago
        type: 'menu',
        read: true
      },
      {
        id: '4',
        title: 'Complete seu cadastro',
        description: 'Complete algumas informações que estão faltando',
        date: new Date(Date.now() - 86400000), // 1 day ago
        type: 'register',
        read: true
      },
      {
        id: '5',
        title: 'Finalização de cadastro',
        description: 'Bem-vindo! Você finalizou seu cadastro com sucesso',
        date: new Date(Date.now() - 172800000), // 2 days ago
        type: 'complete',
        read: true
      }
    ];
    
    setNotifications(demoNotifications);
    
    // Listen for new notifications (in a real app, this would connect to your backend)
    const subscription = supabase
      .channel('public:notifications')
      .on('broadcast', { event: 'new-notification' }, (payload) => {
        if (payload.payload) {
          const newNotification = payload.payload as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          toast({
            title: newNotification.title,
            description: newNotification.description,
          });
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotifications,
        toggleNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
