import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import { useNotifications } from '../contexts/NotificationContext';
import { MapPin, Bell, Book, Calendar, Edit, Check, Trash2, Eye, Trash, UtensilsCrossed } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const Notifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteAllNotifications 
  } = useNotifications();
  const [userType, setUserType] = useState<'aluno' | 'professor' | 'nutricionista' | null>(null);
  const [draggedNotification, setDraggedNotification] = useState<{ id: string, offset: number } | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profile?.user_type) {
          setUserType(profile.user_type as 'aluno' | 'professor' | 'nutricionista');
        }
      } else {
        // Se não houver usuário logado, redireciona para login
        navigate('/login');
      }
    };

    checkUserType();
  }, [navigate]);

  const getBackPath = () => {
    switch (userType) {
      case 'aluno':
        return '/aluno/dashboard';
      case 'professor':
        return '/professor/dashboard';
      case 'nutricionista':
        return '/nutricionista/dashboard';
      default:
        return '/login';
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
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
      case 'meal_attendance':
        return <UtensilsCrossed size={20} className="text-accent" />;
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

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    setDraggedNotification({ id, offset: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedNotification) return;
    
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const offset = touch.clientX - rect.left;
    
    setDraggedNotification(prev => prev ? { ...prev, offset } : null);
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    if (!draggedNotification) return;

    const offset = draggedNotification.offset;
    if (offset > 100) { // Arrastou para direita - deletar
      deleteNotification(id);
    } else if (offset < -100) { // Arrastou para esquerda - marcar como lido
      markAsRead(id);
    }
    
    setDraggedNotification(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to={getBackPath()} label="Notificações" />
      </div>
      
      {notifications.length > 0 ? (
        <>
          <div className="px-4 py-2 flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Marcar todas como lidas
              </button>
              <button 
                onClick={deleteAllNotifications}
                className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors hidden md:block"
              >
                Excluir todas
              </button>
            </div>
          </div>
          
          <div className="flex-1 divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 flex items-start cursor-pointer transition-colors hover:bg-gray-50 relative",
                  !notification.read && "bg-gray-50"
                )}
                style={{
                  transform: draggedNotification?.id === notification.id 
                    ? `translateX(${draggedNotification.offset}px)` 
                    : undefined,
                  transition: draggedNotification?.id === notification.id 
                    ? 'none' 
                    : 'transform 0.2s ease-out'
                }}
                onTouchStart={(e) => handleTouchStart(e, notification.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, notification.id)}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mr-3 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary">{notification.title}</h3>
                  <p className="text-sm text-amber-500 mb-1">{formatDate(notification.date)}</p>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="ml-4 text-red-500 hover:text-red-600 transition-colors hidden md:block"
                >
                  <Trash2 size={20} />
                </button>
                {/* Indicadores de ação mobile */}
                {draggedNotification?.id === notification.id && (
                  <>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 md:hidden">
                      <Trash size={24} />
                    </div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary md:hidden">
                      <Eye size={24} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Bell size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-500 mb-2">Sem notificações</h2>
          <p className="text-sm text-gray-400 text-center">
            Você não tem notificações no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
