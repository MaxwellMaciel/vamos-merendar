
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from 'lucide-react';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('Anna Maria');
  const [phone, setPhone] = useState('(85) 9 8888-8888');
  const [email, setEmail] = useState('anamaria@teste.com');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [tempValue, setTempValue] = useState('');
  
  const handleEditField = (field: 'name' | 'phone' | 'email', currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };
  
  const handleSaveField = () => {
    if (!editingField) return;
    
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
    
    setEditingField(null);
  };
  
  const getFieldName = (field: 'name' | 'phone' | 'email') => {
    switch(field) {
      case 'name': return 'nome';
      case 'phone': return 'telefone';
      case 'email': return 'e-mail';
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
