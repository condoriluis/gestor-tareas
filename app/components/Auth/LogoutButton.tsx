'use client';

import { showToast } from "@/utils/toastMessages";
import { useState } from 'react';
import { MdLogout } from 'react-icons/md';

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        window.location.href = '/login';
        showToast('Cierre de sesión exitoso.', 'success');
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      showToast('Error al cerrar sesión', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-gray-300 hover:text-white text-sm sm:text-base transition cursor-pointer flex items-center gap-1"
      >
        <span><MdLogout size={20} /></span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
          <div className="bg-[#2A2A2A] border border-gray-700 rounded-xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-white mb-4">Confirmar cierre de sesión</h3>
            <p className="text-gray-300 mb-6">¿Estás seguro que deseas cerrar sesión?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isLoggingOut}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
