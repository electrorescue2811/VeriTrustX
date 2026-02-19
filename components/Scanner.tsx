import React, { useRef, useEffect, useState } from 'react';

interface ScannerProps {
  onScan: (data: string) => void;
  active: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!active) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [active]);

  return (
    <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
      {active && hasPermission === true && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      )}
      
      {active && hasPermission === false && (
        <div className="text-white text-center p-4">
          <i className="fas fa-camera-slash text-3xl mb-2"></i>
          <p>Camera access denied or unavailable.</p>
        </div>
      )}

      {/* Scanner Overlay UI */}
      <div className="absolute inset-0 border-2 border-brand-500/50 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-brand-400 rounded-lg relative animate-pulse">
           <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-500 -mt-1 -ml-1"></div>
           <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-500 -mt-1 -mr-1"></div>
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-500 -mb-1 -ml-1"></div>
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-500 -mb-1 -mr-1"></div>
        </div>
        <p className="mt-4 text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm">
          Align QR Code within frame
        </p>
      </div>
    </div>
  );
};
