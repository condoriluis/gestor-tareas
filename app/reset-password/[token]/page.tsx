'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { showToast } from '@/utils/toastMessages';
import { MdLock, MdCheck, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsDone(true);
        showToast('Contraseña actualizada correctamente.', 'success');
      } else {
        showToast(data.error || 'Error al restablecer la contraseña.', 'error');
      }
    } catch {
      showToast('Error de conexión.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#2A2A2A] rounded-xl shadow-lg overflow-hidden border border-gray-600 p-8 sm:p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
              <MdCheck className="text-[#00E57B]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Contraseña actualizada</h2>
            <p className="text-gray-400 mb-6">Tu contraseña se ha restablecido correctamente.</p>
            <Link
              href="/login"
              className="inline-block w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-[#00E57B] hover:bg-teal-600 transition-colors text-center"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Nueva contraseña</h2>
            <p className="text-center text-gray-400 mb-6">Ingresa tu nueva contraseña.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2A2A2A] border-b border-gray-600 focus:border-[#00E57B] focus:outline-none text-white placeholder-gray-400"
                  placeholder="Nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2A2A2A] border-b border-gray-600 focus:border-[#00E57B] focus:outline-none text-white placeholder-gray-400"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
                >
                  {showConfirm ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-[#00E57B] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E57B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <MdLock size={18} />
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
