'use client';

import { useState } from 'react';
import { MdClose, MdVisibility, MdVisibilityOff, MdAdminPanelSettings, MdPerson } from 'react-icons/md';
import { formatDate } from '@/utils/dateFormat';
import { showToast } from '@/utils/toastMessages';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name_user?: string;
    email_user?: string;
    rol_user?: string;
    date_created_user?: string;
  } | null;
};

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar la contraseña');
    }

    return await response.json();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError('');
    setSuccess('');
  
    if (!currentPassword.trim()) {
      showToast('Por favor ingresa tu Contraseña Actual', 'error');
      return;
    }
  
    if (!newPassword.trim()) {
      showToast('Por favor ingresa tu Nueva Contraseña', 'error');
      return;
    }
  
    if (newPassword.length < 6) {
      showToast('La Nueva Contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
  
    if (!confirmPassword.trim()) {
      showToast('Por favor confirma tu Nueva Contraseña', 'error');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      showToast('Las Nuevas Contraseñas no coinciden', 'error');
      return;
    }
  
    try {
      await updatePassword(currentPassword, newPassword);
      showToast('Contraseña actualizada correctamente.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al actualizar la contraseña', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-[#2A2A2A] rounded-xl w-full max-w-md border border-gray-600 overflow-hidden animate-fade-in-up">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
          >
            <MdClose size={24} />
          </button>
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mb-4 border-4 border-[#00E57B]">
              {user?.name_user ? (
                <span className="text-white text-2xl font-medium">
                  {user.name_user.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-white text-2xl font-medium">U</span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white">{user?.name_user || 'Usuario'}</h3>
            <p className="text-gray-400">{user?.email_user || 'correo@correo.com'}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                user?.rol_user === 'admin' 
                  ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
                  : 'bg-blue-900 text-blue-100 border border-blue-700 hover:bg-blue-800'
              }`}>
                {user?.rol_user === 'admin' ? <MdAdminPanelSettings size={14} /> : <MdPerson size={14} />}
                {user?.rol_user ? user.rol_user.charAt(0).toUpperCase() + user.rol_user.slice(1) : 'User'}
              </span>
            </div>
          </div>
          
          {showPasswordForm ? (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-4">Cambiar contraseña</h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    placeholder="Contraseña actual"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    placeholder="Nueva contraseña"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Confirmar nueva contraseña"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                  </button>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#00E57B] hover:bg-teal-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#1E1E1E] rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Información de la cuenta</h4>
                <p className="text-white">Miembro desde: {formatDate(user?.date_created_user || '')}</p>
              </div>
              
              <button 
                className="w-full py-3 bg-[#00E57B] hover:bg-teal-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
                onClick={() => setShowPasswordForm(true)}
              >
                Cambiar contraseña
              </button>
              
              <button 
                className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
