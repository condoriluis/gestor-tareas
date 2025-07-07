'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from "@/utils/toastMessages";
import { MdEmail, MdLock, MdPerson, MdAppRegistration, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameInput = e.currentTarget.querySelector('#name') as HTMLInputElement;
    const emailInput = e.currentTarget.querySelector('#email') as HTMLInputElement;
    const passwordInput = e.currentTarget.querySelector('#password') as HTMLInputElement;
    
    let isValid = true;
    
    if (!name.trim()) {
      showToast('Por favor ingresa tu nombre completo', 'error');
      nameInput.focus();
      isValid = false;
    }
    
    if (!email.trim()) {
      showToast('Por favor ingresa tu correo electrónico', 'error');
      if (isValid) emailInput.focus();
      isValid = false;
    } else if (!validateEmail(email)) {
      showToast('Por favor ingresa un correo electrónico válido', 'error');
      if (isValid) emailInput.focus();
      isValid = false;
    }
    
    if (!password.trim()) {
      showToast('Por favor ingresa tu contraseña', 'error');
      if (isValid) passwordInput.focus();
      isValid = false;
    } else if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      if (isValid) passwordInput.focus();
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {

        showToast('Registro exitoso! Por favor inicia sesión.', 'success');
        router.push('/login');
        
      } else {
        showToast(data.error || 'Registro fallido.', 'error');
      }
    } catch (error) {
      showToast('Error interno del servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="p-8 sm:p-10">
            
            <h2 className="text-2xl font-bold text-center text-white mb-6">Registro</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPerson className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border-b border-gray-600 focus:border-[#00E57B] focus:outline-none text-white placeholder-gray-400"
                  placeholder="Nombre completo"
                />
              </div>

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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2A2A2A] border-b border-gray-600 focus:border-[#00E57B] focus:outline-none text-white placeholder-gray-400"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00E57B] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E57B] disabled:opacity-50 cursor-pointer transition-colors"
                >
                  <MdAppRegistration size={18} />
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-medium text-[#00E57B] hover:text-teal-400 transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
