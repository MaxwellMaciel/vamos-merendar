import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useNotifications } from '../../contexts/NotificationContext';
import { MapPin, Bell, Book, Calendar, Edit, Check, UtensilsCrossed, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { Database } from '@/types/supabase';

const NotificationType = {
  attendance: { icon: MapPin, label: 'Presença' },
  class: { icon: Bell, label: 'Aula' },
  menu: { icon: Book, label: 'Cardápio' },
  register: { icon: Edit, label: 'Cadastro' },
  complete: { icon: Check, label: 'Conclusão' },
  meal_attendance: { icon: UtensilsCrossed, label: 'Presença em Refeição' }
};

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const [showNewNotificationDialog, setShowNewNotificationDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
    type: 'menu' as keyof typeof NotificationType,
    targetAudience: {
      alunos: true,
      professores: false
    }
  });
  const [viewType, setViewType] = useState('received');

  const handleSendNotification = async () => {
    try {
      // Buscar o ID do usuário atual (nutricionista)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar IDs dos usuários alvo
      const { data: targetUsers, error: userError } = await supabase
        .from('profiles')
        .select('user_id, user_type')
        .in('user_type', Object.entries(newNotification.targetAudience)
          .filter(([_, value]) => value)
          .map(([key]) => key === 'alunos' ? 'aluno' : 'professor'));

      if (userError) throw userError;

      if (!targetUsers?.length) {
        toast({
          title: "Erro",
          description: "Selecione pelo menos um público-alvo para a notificação.",
          variant: "destructive",
        });
        return;
      }

      // Criar notificações para cada usuário
      const notificationsToInsert: Database['public']['Tables']['notifications']['Insert'][] = targetUsers.map(targetUser => ({
        user_id: targetUser.user_id,
        title: newNotification.title,
        description: newNotification.description,
        type: newNotification.type as Database['public']['Tables']['notifications']['Row']['type'],
        target_audience: Object.entries(newNotification.targetAudience)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        created_by: user.id,
        read: targetUser.user_type === 'nutricionista'
      }));

      // Adicionar notificação para a nutricionista (já marcada como lida)
      notificationsToInsert.push({
        user_id: user.id,
        title: newNotification.title,
        description: newNotification.description,
        type: newNotification.type as Database['public']['Tables']['notifications']['Row']['type'],
        target_audience: Object.entries(newNotification.targetAudience)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        created_by: user.id,
        read: true // Sempre marcada como lida para a nutricionista
      });

      console.log('Enviando notificações:', notificationsToInsert);

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notificationsToInsert);

      if (insertError) {
        console.error('Erro ao inserir notificações:', insertError);
        throw insertError;
      }

      // Mostrar notificação de sucesso
      toast({
        title: "Notificação Enviada",
        description: `A notificação foi enviada com sucesso para ${targetUsers.length} ${targetUsers.length === 1 ? 'usuário' : 'usuários'}.`,
        variant: "success",
        duration: 5000,
      });

      setShowNewNotificationDialog(false);
      setNewNotification({
        title: '',
        description: '',
        type: 'menu',
        targetAudience: {
          alunos: true,
          professores: false
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) => {
    const Icon = NotificationType[type as keyof typeof NotificationType]?.icon || Bell;
    return <Icon size={20} className="text-accent" />;
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
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4 border-b border-gray-200">
        <BackButton to="/nutricionista/dashboard" label="Notificações" />
      </div>
      
      <div className="px-4 py-2 flex justify-between items-center">
        <h2 className="text-xl font-medium text-primary">Gerenciar Notificações</h2>
        <Dialog open={showNewNotificationDialog} onOpenChange={setShowNewNotificationDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus size={20} className="mr-2" />
              Nova Notificação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Enviar Nova Notificação</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Título</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da notificação"
                  className="bg-white border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Mensagem</Label>
                <Textarea
                  id="description"
                  value={newNotification.description}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite a mensagem da notificação"
                  rows={4}
                  className="bg-white border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">Ícone</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(NotificationType).map(([key, { icon: Icon, label }]) => (
                    <button
                      key={key}
                      onClick={() => setNewNotification(prev => ({ ...prev, type: key as keyof typeof NotificationType }))}
                      className={cn(
                        "p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors",
                        newNotification.type === key
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                    >
                      <Icon size={20} className={cn(
                        "transition-colors",
                        newNotification.type === key ? "text-primary" : "text-gray-500"
                      )} />
                      <span className="text-xs text-gray-600">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">Público-alvo</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alunos"
                      checked={newNotification.targetAudience.alunos}
                      onCheckedChange={(checked) => 
                        setNewNotification(prev => ({
                          ...prev,
                          targetAudience: {
                            ...prev.targetAudience,
                            alunos: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="alunos" className="text-gray-700">Alunos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="professores"
                      checked={newNotification.targetAudience.professores}
                      onCheckedChange={(checked) => 
                        setNewNotification(prev => ({
                          ...prev,
                          targetAudience: {
                            ...prev.targetAudience,
                            professores: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="professores" className="text-gray-700">Professores</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewNotificationDialog(false)}
                className="border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.description}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Enviar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant={viewType === 'received' ? 'default' : 'outline'}
            onClick={() => setViewType('received')}
            className={cn(
              "flex-1",
              viewType === 'received' ? "bg-primary text-white hover:bg-primary/90" : "text-gray-700"
            )}
          >
            Recebidas
          </Button>
          <Button
            variant={viewType === 'sent' ? 'default' : 'outline'}
            onClick={() => setViewType('sent')}
            className={cn(
              "flex-1",
              viewType === 'sent' ? "bg-primary text-white hover:bg-primary/90" : "text-gray-700"
            )}
          >
            Enviadas
          </Button>
        </div>
      </div>
      
      <div className="flex-1 divide-y">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={cn(
              "p-4 flex items-start cursor-pointer transition-colors hover:bg-gray-50",
              !notification.read && "bg-gray-50"
            )}
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
              className="ml-4 text-[#f45b43] hover:text-[#f45b43]/80 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 