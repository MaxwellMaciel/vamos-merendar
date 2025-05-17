import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuração do scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    // Inicializa o scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    // Inicia o scanner
    scannerRef.current.render(onScanSuccess, onScanError);

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div ref={containerRef} className="w-full">
      <div id="qr-reader" className="w-full"></div>
    </div>
  );
};

export default QRCodeScanner; 