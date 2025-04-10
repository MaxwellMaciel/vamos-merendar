import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  matricula: string | null;
  siape: string | null;
  user_id: string;
  user_type: 'aluno' | 'nutricionista';
  dietary_restrictions?: string | null;
  created_at?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('useProfile - Iniciando fetchProfile'); // Debug log
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('useProfile - Auth user:', user); // Debug log
      
      if (userError) {
        console.error('useProfile - Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        console.log('useProfile - No authenticated user found');
        setLoading(false);
        return;
      }

      setUserId(user.id);
      console.log('useProfile - User ID set:', user.id); // Debug log
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('useProfile - Profile query result:', { data, error }); // Debug log
      
      if (error) {
        console.error('useProfile - Error fetching profile:', error);
        throw error;
      }
      
      if (data) {
        console.log('useProfile - Setting profile data:', data); // Debug log
        setProfile(data as Profile);
      } else {
        console.log('useProfile - No profile data found'); // Debug log
      }
    } catch (error: any) {
      console.error('useProfile - Error in fetchProfile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) {
      console.error('useProfile - No userId available for update'); // Debug log
      return;
    }

    try {
      console.log('useProfile - Starting profile update with:', updates); // Debug log
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) {
        console.error('useProfile - Error updating profile:', error); // Debug log
        throw error;
      }

      console.log('useProfile - Profile updated successfully, fetching new data'); // Debug log
      await fetchProfile();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (error: any) {
      console.error('useProfile - Error in updateProfile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    userId,
    fetchProfile,
    updateProfile
  };
} 