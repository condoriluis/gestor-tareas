'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from "@/utils/toastMessages";
import { MdEmail, MdLock, MdLogin, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  useEffect(() => {
    if (rememberEmail && email) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }, [rememberEmail, email]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailInput = e.currentTarget.querySelector('#email') as HTMLInputElement;
    const passwordInput = e.currentTarget.querySelector('#password') as HTMLInputElement;
    
    let isValid = true;
    
    if (!email.trim()) {
      showToast('Por favor ingresa tu correo electrónico', 'error');
      emailInput.focus();
      isValid = false;
    } else if (!validateEmail(email)) {
      showToast('Por favor ingresa un correo electrónico válido', 'error');
      emailInput.focus();
      isValid = false;
    }
    
    if (!password.trim()) {
      showToast('Por favor ingresa tu contraseña', 'error');
      if (isValid) passwordInput.focus();
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsLoading(true);

    try {
      await login(email, password);
      showToast('Inicio de sesión exitoso.', 'success');
      router.push('/task');
    } catch (error) {
      showToast('Credenciales incorrectas.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg overflow-hidden border border-gray-600">
          <div className="p-8 sm:p-10">
            
            <h2 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>
            
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

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-email"
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="remember-email" className="ml-2 text-sm text-gray-300">
                    Recordar ingreso
                  </label>
                </div>
                <div className="flex items-center">
                  <a href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-500 cursor-pointer">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00E57B] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E57B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <MdLogin size={18} />
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link href="/register" className="font-medium text-[#00E57B] hover:text-teal-600 transition-colors">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
