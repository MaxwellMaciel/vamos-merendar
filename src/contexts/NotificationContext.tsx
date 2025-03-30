import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/use-profile';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'attendance' | 'class' | 'menu' | 'register' | 'complete' | 'meal_attendance';
  read: boolean;
  target_audience?: string[];
}

export interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  unreadCount: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

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
  const { profile } = useProfile();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (profile?.user_id) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [profile?.user_id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile?.user_id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const filteredNotifications = data.filter(notification => {
        if (!notification.target_audience) return true;
        const userType = profile?.user_type;
        return notification.target_audience.includes(userType === 'aluno' ? 'alunos' : 'professores');
      });

      setNotifications(filteredNotifications.map(notification => ({
        ...notification,
        date: new Date(notification.created_at),
        read: notification.read || false
      })));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile?.user_id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          if (!newNotification.target_audience || 
              newNotification.target_audience.includes(profile?.user_type === 'aluno' ? 'alunos' : 'professores')) {
            const notification = {
              ...newNotification,
              date: new Date(newNotification.created_at),
              read: false
            };
            setNotifications(prev => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile?.user_id)
        .is('deleted_at', null);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', profile?.user_id)
        .is('deleted_at', null);

      if (error) throw error;

      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: profile?.user_id,
          title: notification.title,
          description: notification.description,
          type: notification.type,
          target_audience: notification.target_audience,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      const newNotification = {
        ...data,
        date: new Date(data.created_at),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        addNotification,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
