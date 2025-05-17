import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess,
  onScanError 
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    console.log('QRCodeScanner - Iniciando verificação de permissão');
    
    // Verifica permissão da câmera
    const checkCameraPermission = async () => {
      try {
        console.log('QRCodeScanner - Verificando suporte do navegador');
        // Primeiro, verifica se o navegador suporta a API
        if (!navigator.mediaDevices) {
          console.error('QRCodeScanner - navigator.mediaDevices não está disponível');
          throw new Error('Seu navegador não suporta acesso à câmera');
        }

        if (!navigator.mediaDevices.getUserMedia) {
          console.error('QRCodeScanner - getUserMedia não está disponível');
          throw new Error('Seu navegador não suporta acesso à câmera');
        }

        console.log('QRCodeScanner - Solicitando permissão da câmera');
        // Solicita permissão explicitamente
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        console.log('QRCodeScanner - Permissão concedida, stream obtido:', stream);
        // Para o stream após obter permissão
        stream.getTracks().forEach(track => {
          console.log('QRCodeScanner - Parando track:', track.label);
          track.stop();
        });
        
        setHasPermission(true);
        console.log('QRCodeScanner - Estado atualizado: hasPermission = true');
      } catch (err) {
        console.error('QRCodeScanner - Erro detalhado ao acessar câmera:', err);
        console.error('QRCodeScanner - Tipo do erro:', err instanceof Error ? err.constructor.name : typeof err);
        console.error('QRCodeScanner - Mensagem do erro:', err instanceof Error ? err.message : String(err));
        
        setHasPermission(false);
        if (onScanError) {
          onScanError(err instanceof Error ? err.message : 'Erro ao acessar a câmera');
        }
      }
    };

    checkCameraPermission();
  }, [onScanError]);

  useEffect(() => {
    console.log('QRCodeScanner - Efeito de inicialização:', {
      containerRef: !!containerRef.current,
      hasPermission,
      isInitialized
    });

    if (!containerRef.current || !hasPermission || isInitialized) {
      console.log('QRCodeScanner - Condições não atendidas para inicialização');
      return;
    }

    console.log('QRCodeScanner - Iniciando configuração do scanner');
    // Configuração do scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      rememberLastUsedCamera: true,
      showScanButton: false,
      showTorchButton: true,
      showZoomSlider: true,
      defaultZoom: 2,
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    try {
      console.log('QRCodeScanner - Criando instância do scanner');
      // Inicializa o scanner
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      );

      console.log('QRCodeScanner - Configurando callbacks');
      // Configura callbacks
      scannerRef.current.render(
        (decodedText) => {
          console.log('QRCodeScanner - QR Code detectado:', decodedText);
          setIsScanning(true);
          onScanSuccess(decodedText);
        },
        (error) => {
          console.error('QRCodeScanner - Erro durante escaneamento:', error);
          if (onScanError) {
            onScanError(error);
          }
        }
      );

      setIsInitialized(true);
      console.log('QRCodeScanner - Scanner inicializado com sucesso');
    } catch (error) {
      console.error('QRCodeScanner - Erro ao inicializar scanner:', error);
      if (onScanError) {
        onScanError('Erro ao inicializar o scanner de QR Code');
      }
    }

    return () => {
      console.log('QRCodeScanner - Limpando scanner');
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [hasPermission, isInitialized, onScanSuccess, onScanError]);

  const handleRetry = () => {
    console.log('QRCodeScanner - Tentando novamente');
    setHasPermission(null);
    setIsInitialized(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };

  console.log('QRCodeScanner - Renderizando com estado:', {
    hasPermission,
    isInitialized,
    isScanning
  });

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Acesso à câmera negado
        </h3>
        <p className="text-gray-500 mb-4">
          Para usar o leitor de QR Code, precisamos de permissão para acessar sua câmera.
          Por favor, verifique as configurações de permissão do seu navegador.
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#244b2c] hover:bg-[#244b2c]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#244b2c]"
        >
          <RefreshCw size={16} className="mr-2" />
          Tentar novamente
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Camera size={48} className="text-gray-400 mb-4 animate-pulse" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Solicitando acesso à câmera
        </h3>
        <p className="text-gray-500">
          Por favor, permita o acesso à câmera quando o navegador solicitar.
          Se o prompt não aparecer, verifique se seu navegador está bloqueando pop-ups.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        id="qr-reader"
        className="w-full max-w-md"
      />
      {isScanning && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            QR Code detectado! Processando...
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner; 