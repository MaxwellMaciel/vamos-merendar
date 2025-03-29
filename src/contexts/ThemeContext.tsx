import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_NAMES, TOTAL_BLACK_COLORS, type ThemeName } from '@/constants/themes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ThemeContextType = {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(THEME_NAMES.DEFAULT);
  const { toast } = useToast();

  // Carregar tema do usuário ao iniciar
  useEffect(() => {
    loadUserTheme();
  }, []);

  // Aplicar as cores do tema
  useEffect(() => {
    applyThemeColors(currentTheme);
  }, [currentTheme]);

  const loadUserTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: themeData, error } = await supabase
        .from('user_theme_preferences')
        .select('theme_name')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (themeData) {
        setCurrentTheme(themeData.theme_name as ThemeName);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const applyThemeColors = (themeName: ThemeName) => {
    const root = document.documentElement;
    
    if (themeName === THEME_NAMES.TOTAL_BLACK) {
      Object.entries(TOTAL_BLACK_COLORS).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    } else {
      // Remover variáveis customizadas para voltar ao tema padrão
      Object.keys(TOTAL_BLACK_COLORS).forEach((key) => {
        root.style.removeProperty(`--${key}`);
      });
    }
  };

  const setTheme = async (newTheme: ThemeName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_theme_preferences')
        .upsert({
          user_id: user.id,
          theme_name: newTheme,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setCurrentTheme(newTheme);
      
      toast({
        title: "Tema atualizado",
        description: "Suas preferências de tema foram salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      toast({
        title: "Erro ao atualizar tema",
        description: "Não foi possível salvar suas preferências de tema.",
        variant: "destructive",
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 