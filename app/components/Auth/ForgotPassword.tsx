'use client'

import { useState } from 'react';
import { showToast } from '@/utils/toastMessages';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('El correo electrónico es necesario.', 'error');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Ingresa un correo electrónico válido.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (res.ok) {

        showToast(data.message || `Revisa tu bandeja de entrada y la carpeta de SPAM.`, 'success');
        router.push('/login');
        
      } else {
        showToast(data.error || 'Error al enviar el correo.', 'error');
      }
    } catch (error) {
      showToast('Error de conexión.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="p-8 sm:p-10">
            
            <h2 className="text-2xl font-bold text-center text-white mb-6">Recuperar Contraseña</h2>
            <p className="text-center text-gray-400 mb-6">Ingresa tu correo electrónico y te enviaremos un correo con instrucciones para restablecer tu contraseña.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border-b border-gray-600 focus:border-[#00E57B] focus:outline-none text-white placeholder-gray-400"
                  placeholder="Correo electrónico"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00E57B] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E57B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <MdEmail size={18} />
                  {isLoading ? 'Enviando correo...' : 'Enviar correo'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link href="/login" className="font-medium text-[#00E57B] hover:text-teal-600 transition-colors">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
