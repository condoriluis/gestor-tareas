'use client';

import { useState } from 'react';
import { MdClose, MdOutlineSave } from 'react-icons/md';
import { showToast } from '@/utils/toastMessages';
import { User } from '@/utils/types';

type EditUserProps = {
  user: User;
  onClose: () => void;
  onSave: (userData: {idUser: number; name: string; email: string; rol: string}) => Promise<boolean>;
};

export default function EditUser({ user, onClose, onSave }: EditUserProps) {
  const [formData, setFormData] = useState({
    name: user.name_user,
    email: user.email_user,
    rol: user.rol_user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await onSave({
        idUser: user.id_user,
        ...formData
      });
      
      if (success) {
        onClose();
      }
    } catch (error) {
      showToast('Error al actualizar usuario', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Editar Usuario</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <MdClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Rol</label>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md bg-[#00E57B] text-white hover:bg-[#00C96B] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MdOutlineSave size={18} />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
