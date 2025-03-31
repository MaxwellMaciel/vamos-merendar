import React from 'react';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/ui/BackButton';
import { Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_NAMES } from '@/constants/themes';
import { cn } from '@/lib/utils';

const Theme = () => {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeSelect = async (themeName: string) => {
    await setTheme(themeName as keyof typeof THEME_NAMES);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4">
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
            {/* Total White Theme */}
            <div 
              className={cn(
                "bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border",
                currentTheme === THEME_NAMES.TOTAL_WHITE && "ring-2 ring-primary"
              )}
              onClick={() => handleThemeSelect(THEME_NAMES.TOTAL_WHITE)}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Total White</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-white border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Total White Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Total Black Theme */}
            <div 
              className={cn(
                "bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border",
                currentTheme === THEME_NAMES.TOTAL_BLACK && "ring-2 ring-primary"
              )}
              onClick={() => handleThemeSelect(THEME_NAMES.TOTAL_BLACK)}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Total Black</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-black border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Total Black Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Dark Mode Theme */}
            <div className="bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Dark Mode</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Dark Mode Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Default Theme */}
            <div 
              className={cn(
                "bg-white/30 hover:bg-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border",
                currentTheme === THEME_NAMES.DEFAULT && "ring-2 ring-primary"
              )}
              onClick={() => handleThemeSelect(THEME_NAMES.DEFAULT)}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Default</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-[#244b2c]/10 border border-border/50">
                <img 
                  src="/logo.png" 
                  alt="Default Theme Preview" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme; 