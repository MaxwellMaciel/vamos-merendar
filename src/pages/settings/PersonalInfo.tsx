import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/use-profile';
import Loading from '@/components/Loading';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading, userId, updateProfile } = useProfile();
  
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('PersonalInfo - Current profile state:', profile); // Debug log

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) {
      console.log('PersonalInfo - No file selected or no userId available'); // Debug log
      return;
    }

    try {
      setLoading(true);
      console.log('PersonalInfo - Starting image upload process'); // Debug log

      // 1. Upload the image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('PersonalInfo - Uploading file:', {
        fileName,
        fileType: file.type,
        fileSize: file.size,
        bucket: 'profile-images'
      });

      // Upload para o bucket profile-images
      const { error: uploadError, data } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('PersonalInfo - Error uploading file:', uploadError);
        throw uploadError;
      }

      console.log('PersonalInfo - Upload successful:', data);

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      console.log('PersonalInfo - Generated public URL:', publicUrl);

      // 3. Update the profile with the new image URL
      await updateProfile({ profile_image: publicUrl });
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso!",
      });
    } catch (error: any) {
      console.error('PersonalInfo - Full error details:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field: 'name' | 'phone' | 'email', currentValue: string) => {
    console.log('PersonalInfo - Editing field:', { field, currentValue }); // Debug log
    setEditingField(field);
    setTempValue(currentValue);
  };
  
  const handleSaveField = async () => {
    if (!editingField) return;
    
    try {
      console.log('PersonalInfo - Saving field:', { field: editingField, value: tempValue }); // Debug log
      setLoading(true);
      await updateProfile({ [editingField]: tempValue });
      setEditingField(null);
    } catch (error: any) {
      console.error('PersonalInfo - Error updating field:', error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar seu ${getFieldName(editingField)}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getFieldName = (field: 'name' | 'phone' | 'email') => {
    switch(field) {
      case 'name': return 'nome';
      case 'phone': return 'telefone';
      case 'email': return 'e-mail';
    }
  };

  if (profileLoading) {
    return <Loading message="Carregando informações pessoais..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Dados Pessoais" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary">
                {profile?.profile_image ? (
                  <AvatarImage 
                    src={profile.profile_image} 
                    alt="Profile" 
                    onError={(e) => {
                      console.error('PersonalInfo - Error loading profile image:', e);
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '';
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-accent text-primary">
                    <User size={32} />
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="profile-image" 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera size={16} />
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileImageChange}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center p-3 border border-border rounded-lg bg-white/30 text-card-foreground hover:bg-white/40 transition-colors cursor-pointer shadow-md"
              onClick={() => handleEditField('name', profile?.name || '')}
            >
              <div>
                <div className="text-sm text-muted-foreground">Nome</div>
                <div className="font-medium">{profile?.name}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
            
            <div 
              className="flex justify-between items-center p-3 border border-border rounded-lg bg-white/30 text-card-foreground hover:bg-white/40 transition-colors cursor-pointer shadow-md"
              onClick={() => handleEditField('phone', profile?.phone || '')}
            >
              <div>
                <div className="text-sm text-muted-foreground">Telefone</div>
                <div className="font-medium">{profile?.phone}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
            
            <div 
              className="flex justify-between items-center p-3 border border-border rounded-lg bg-white/30 text-card-foreground hover:bg-white/40 transition-colors cursor-pointer shadow-md"
              onClick={() => handleEditField('email', profile?.email || '')}
            >
              <div>
                <div className="text-sm text-muted-foreground">E-mail</div>
                <div className="font-medium">{profile?.email}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {getFieldName(editingField || 'name')}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-2 border border-border bg-white/30 text-foreground rounded-md shadow-md"
              placeholder={`Digite seu ${getFieldName(editingField || 'name')}`}
            />
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  Cancelar
                </button>
              </DialogClose>
              <button
                onClick={handleSaveField}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalInfo;
