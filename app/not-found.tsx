'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-[#2A2A2A] rounded-xl shadow-lg p-8 border border-red-500/30">
        <div className="flex justify-center mb-6">
          <FiAlertTriangle className="text-red-500" size={64} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">404 - Página no encontrada</h1>
        <p className="text-gray-300 mb-6">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 px-6 bg-[#00E57B] hover:bg-teal-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
