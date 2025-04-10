import React, { useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/ui/BackButton';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_NAMES } from '@/constants/themes';
import { cn } from '@/lib/utils';

const Theme = () => {
  const { currentTheme, setTheme } = useTheme();

  useEffect(() => {
    console.log('Tema atual carregado:', currentTheme);
  }, [currentTheme]);

  const handleThemeSelect = async (themeName: string) => {
    console.log('Selecionando tema:', themeName);
    await setTheme(themeName as keyof typeof THEME_NAMES);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4 border-b border-gray-100">
        <BackButton to="/settings" label="Personalização" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Palette size={36} className="text-primary" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
          Escolha um tema
        </h2>
        
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Default Theme (primeiro lugar) */}
            <div 
              className={cn(
                "bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer relative",
                currentTheme === 'DEFAULT' 
                  ? "border-4 border-green-500" 
                  : "border border-border"
              )}
              onClick={() => handleThemeSelect('DEFAULT')}
            >
              {currentTheme === 'DEFAULT' && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-4">Default</h3>
              <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                <img 
                  src="/images/ExemploDeafault.png" 
                  alt="Default Theme Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Tema padrão com fundo branco e detalhes em verde</p>
            </div>
            
            {/* Total White Theme */}
            <div 
              className="bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-not-allowed opacity-50 border border-border relative"
            >
              <div className="absolute inset-0 bg-gray-200/40 rounded-xl flex items-center justify-center">
                <span className="bg-gray-800/70 text-white px-3 py-1 rounded-md text-sm font-medium rotate-[-20deg]">Em breve</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Total White</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-white border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Total White Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Tema branco total</p>
            </div>

            {/* Total Black Theme */}
            <div 
              className="bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-not-allowed opacity-50 border border-border relative"
            >
              <div className="absolute inset-0 bg-gray-200/40 rounded-xl flex items-center justify-center">
                <span className="bg-gray-800/70 text-white px-3 py-1 rounded-md text-sm font-medium rotate-[-20deg]">Em breve</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Total Black</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-black border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Total Black Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Tema preto total</p>
            </div>

            {/* Dark Mode Theme (desativado por enquanto) */}
            <div className="bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-not-allowed opacity-50 border border-border relative">
              <div className="absolute inset-0 bg-gray-200/40 rounded-xl flex items-center justify-center">
                <span className="bg-gray-800/70 text-white px-3 py-1 rounded-md text-sm font-medium rotate-[-20deg]">Em breve</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Dark Mode</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Dark Mode Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Tema escuro (em breve)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme; 