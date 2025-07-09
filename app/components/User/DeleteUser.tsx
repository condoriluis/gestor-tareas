'use client';

import { showToast } from '@/utils/toastMessages';
import { User } from '@/utils/types';
import { MdWarning } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';

type DeleteUserProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteUser({
  isOpen,
  user,
  onClose,
  onConfirm
}: DeleteUserProps) {
  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      showToast('Error al eliminar usuario', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Eliminar Usuario</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            ¿Estás seguro que deseas eliminar al usuario <span className="font-semibold text-white">{user.name_user}</span>?
          </p>
          <div className="flex items-start gap-2 mt-2 p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
            <MdWarning className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">
              <span className="font-medium">Advertencia:</span> Esta acción eliminará permanentemente al usuario y todas sus tareas asociadas.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FiTrash2 />
            Eliminar usuario
          </button>
        </div>
      </div>
    </div>
  );
}
