import React from "react";
import { MdCancel, MdCheckCircle, MdClose } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isProcessing?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-white">
            <MdCancel className="inline-block text-yellow-500 mr-2" />
            {title}
          </h4>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <MdClose size={24} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-[#00E57B] text-white hover:bg-green-500 transition-colors flex items-center gap-2 cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <MdCheckCircle />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
