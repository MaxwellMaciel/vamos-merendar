import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  children,
  title,
  className
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    console.log('BottomSheet - Estado open:', open);
    console.log('BottomSheet - Props recebidas:', { title, className });

    if (open) {
      // Salva a posição atual do scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      console.log('BottomSheet - Fixando scroll');
    } else {
      // Restaura a posição do scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      console.log('BottomSheet - Restaurando scroll');
    }

    return () => {
      // Limpa os estilos ao desmontar o componente
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      console.log('BottomSheet - Limpando estilos');
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Apenas inicia o drag se o toque começar na área do handle
    const target = e.target as HTMLElement;
    const handle = target.closest('.bottom-sheet-handle');
    if (!handle) return;

    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current || !isDraggingRef.current) return;
    
    e.preventDefault(); // Previne o scroll da página
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    
    if (deltaY > 0) { // Só permite arrastar para baixo
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      console.log('BottomSheet - Movendo:', { deltaY });
    }
  };

  const handleTouchEnd = () => {
    if (!sheetRef.current || !isDraggingRef.current) return;
    
    const deltaY = currentYRef.current - startYRef.current;
    console.log('BottomSheet - Touch finalizado:', { deltaY });
    
    if (deltaY > 100) { // Se arrastou mais de 100px, fecha
      onOpenChange(false);
      console.log('BottomSheet - Fechando por arrasto');
    } else {
      // Volta para a posição inicial
      sheetRef.current.style.transform = '';
      console.log('BottomSheet - Voltando para posição inicial');
    }
    
    isDraggingRef.current = false;
  };

  if (!open) {
    console.log('BottomSheet - Não renderizando (open = false)');
    return null;
  }

  console.log('BottomSheet - Renderizando conteúdo');

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => {
          console.log('BottomSheet - Fechando por clique no backdrop');
          onOpenChange(false);
        }}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-transform duration-300",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle - Área arrastável */}
        <div className="bottom-sheet-handle flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button
            onClick={() => {
              console.log('BottomSheet - Fechando por clique no botão');
              onOpenChange(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(90vh - 4rem)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet; 