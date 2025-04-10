import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_NAMES, TOTAL_BLACK_COLORS, TOTAL_WHITE_COLORS, DEFAULT_COLORS, type ThemeName } from '@/constants/themes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ThemeContextType = {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('DEFAULT');
  const { toast } = useToast();

  // Carregar tema do usuário ao iniciar
  useEffect(() => {
    loadUserTheme();
  }, []);

  // Aplicar as cores do tema
  useEffect(() => {
    console.log('Aplicando tema:', currentTheme);
    applyThemeColors(currentTheme);
  }, [currentTheme]);

  const loadUserTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não encontrado, usando tema DEFAULT');
        setCurrentTheme('DEFAULT');
        return;
      }

      const { data: themeData, error } = await supabase
        .from('user_theme_preferences')
        .select('theme_name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('Erro ao buscar tema, usando DEFAULT:', error);
        setCurrentTheme('DEFAULT');
        return;
      }
      
      if (themeData && themeData.theme_name) {
        console.log('Tema encontrado no banco:', themeData.theme_name);
        // Validar se o tema existe em THEME_NAMES
        if (Object.values(THEME_NAMES).includes(themeData.theme_name as ThemeName)) {
          setCurrentTheme(themeData.theme_name as ThemeName);
        } else {
          console.log('Tema inválido, usando DEFAULT');
          setCurrentTheme('DEFAULT');
        }
      } else {
        console.log('Nenhum tema definido, usando DEFAULT');
        setCurrentTheme('DEFAULT');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      setCurrentTheme('DEFAULT');
    }
  };

  const applyThemeColors = (themeName: ThemeName) => {
    const root = document.documentElement;
    
    // Primeiro, limpar quaisquer configurações personalizadas
    const allColorKeys = new Set([
      ...Object.keys(DEFAULT_COLORS),
      ...Object.keys(TOTAL_BLACK_COLORS),
      ...Object.keys(TOTAL_WHITE_COLORS)
    ]);
    
    Array.from(allColorKeys).forEach(key => {
      root.style.removeProperty(`--${key}`);
    });
    
    // Depois, aplicar o tema apropriado
    console.log('Aplicando cores para o tema:', themeName);
    
    if (themeName === 'TOTAL_BLACK') {
      Object.entries(TOTAL_BLACK_COLORS).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    } else if (themeName === 'TOTAL_WHITE') {
      Object.entries(TOTAL_WHITE_COLORS).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    } else {
      // Tema DEFAULT ou qualquer outro tema não reconhecido
      Object.entries(DEFAULT_COLORS).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  };

  const setTheme = async (newTheme: ThemeName) => {
    try {
      console.log('Tentando definir novo tema:', newTheme);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não autenticado, não é possível salvar tema');
        setCurrentTheme(newTheme); // Aplica temporariamente, mas não salva
        return;
      }

      const { error } = await supabase
        .from('user_theme_preferences')
        .upsert({
          user_id: user.id,
          theme_name: newTheme,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar tema no banco:', error);
        throw error;
      }

      console.log('Tema salvo com sucesso no banco:', newTheme);
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