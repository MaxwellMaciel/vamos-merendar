
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
  const [userType, setUserType] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setUserType(data.user_type);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${user.id},user_type.eq.${userType},user_type.is.null`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        if (data) {
          const formattedNotifications: Notification[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: new Date(item.created_at),
            // Ensure type is one of the accepted values or default to 'class'
            type: ['attendance', 'class', 'menu', 'register', 'complete'].includes(item.type || '') 
              ? (item.type as 'attendance' | 'class' | 'menu' | 'register' | 'complete') 
              : 'class',
            read: item.read || false
          }));
          
          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userType) {
      fetchNotifications();
      
      // Set up real-time listener for new notifications
      const channel = supabase
        .channel('notifications_changes')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications' 
          }, 
          (payload) => {
            const newNotification = payload.new as any;
            
            // Check if notification is for this user or user type
            if (newNotification.user_id === null && 
                newNotification.user_type === null || 
                newNotification.user_type === userType) {
              
              // Ensure type is one of the accepted values or default to 'class'
              const notificationType = ['attendance', 'class', 'menu', 'register', 'complete'].includes(newNotification.type || '')
                ? newNotification.type 
                : 'class';
              
              const formattedNotification: Notification = {
                id: newNotification.id,
                title: newNotification.title,
                description: newNotification.description,
                date: new Date(newNotification.created_at),
                type: notificationType,
                read: false
              };
              
              setNotifications(prev => [formattedNotification, ...prev]);
              
              toast({
                title: formattedNotification.title,
                description: formattedNotification.description,
              });
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userType, toast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const markAsRead = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Update in database
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      // Update in state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get IDs of user's notifications
      const notificationIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);

      if (notificationIds.length === 0) return;

      // Update in database
      await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds);
      
      // Update in state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
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
