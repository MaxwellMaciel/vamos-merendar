
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/Loading';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('Para adicionar');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserId(user.id);
        
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, phone, profile_image')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setName(data.name || '');
          setEmail(data.email || user.email || '');
          if (data.phone) setPhone(data.phone);
          if (data.profile_image) setProfileImage(data.profile_image);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas informações.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, toast]);

  const handleEditField = (field: 'name' | 'phone' | 'email', currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };
  
  const handleSaveField = async () => {
    if (!editingField || !userId) return;
    
    try {
      // Update the field in Supabase
      const updates = { [editingField]: tempValue };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      switch(editingField) {
        case 'name':
          setName(tempValue);
          break;
        case 'phone':
          setPhone(tempValue);
          break;
        case 'email':
          setEmail(tempValue);
          break;
      }
      
      toast({
        title: "Informação atualizada",
        description: `Seu ${getFieldName(editingField)} foi atualizado com sucesso!`,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setEditingField(null);
    }
  };
  
  const getFieldName = (field: 'name' | 'phone' | 'email') => {
    switch(field) {
      case 'name': return 'nome';
      case 'phone': return 'telefone';
      case 'email': return 'e-mail';
    }
  };
  
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userId) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageDataUrl = event.target?.result as string;
          setProfileImage(imageDataUrl);
          
          // Save the image URL to Supabase
          const { error } = await supabase
            .from('profiles')
            .update({ profile_image: imageDataUrl })
            .eq('id', userId);
          
          if (error) throw error;
          
          toast({
            title: "Foto atualizada",
            description: "Sua foto de perfil foi atualizada com sucesso!",
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error updating profile image:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar sua foto de perfil.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <Loading message="Carregando suas informações..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Dados Pessoais" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-accent text-primary">
                    <User size={32} />
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="profile-image" 
                className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
              >
                <Camera size={16} />
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              onClick={() => handleEditField('name', name)}
            >
              <div>
                <div className="text-sm text-gray-500">Nome</div>
                <div className="font-medium">{name}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
            
            <div 
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              onClick={() => handleEditField('phone', phone)}
            >
              <div>
                <div className="text-sm text-gray-500">Telefone</div>
                <div className="font-medium">{phone}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
            
            <div 
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              onClick={() => handleEditField('email', email)}
            >
              <div>
                <div className="text-sm text-gray-500">E-mail</div>
                <div className="font-medium">{email}</div>
              </div>
              <button className="text-primary text-sm">Editar</button>
            </div>
          </div>
          
          <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar {editingField && getFieldName(editingField)}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <input
                  type={editingField === 'email' ? 'email' : 'text'}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose className="px-4 py-2 border border-gray-300 rounded-md">
                  Cancelar
                </DialogClose>
                <button 
                  onClick={handleSaveField}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Salvar
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
