import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Fazer logout
      await supabase.auth.signOut();
      
      // Limpar dados do localStorage
      localStorage.clear();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });

      // Redirecionar para a página inicial
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
    >
      <LogOut size={18} />
      <span>Sair da conta</span>
    </button>
  );
};

export default LogoutButton; 