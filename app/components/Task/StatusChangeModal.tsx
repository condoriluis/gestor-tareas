import { useState } from 'react';
import { MdOutlinePending, MdOutlineWork, MdCheckCircle, MdOutlineCancel } from 'react-icons/md';

type Option = {
  label: string;
  value: string;
  disabled: boolean;
};

type StatusChangeModalProps = {
  taskTitle: string;
  options: Option[];
  currentStatus: string;
  onClose: () => void;
  onStatusChange: (status: string) => void;
};

export const StatusChangeModal = ({
  taskTitle,
  options,
  currentStatus,
  onClose,
  onStatusChange
}: StatusChangeModalProps) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'todo': return <MdOutlinePending className="mr-2" size={20} />;
      case 'in_progress': return <MdOutlineWork className="mr-2" size={20} />;
      case 'done': return <MdCheckCircle className="mr-2" size={20} />;
      default: return <MdOutlineCancel className="mr-2" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-[#343434] rounded-lg p-6 w-full max-w-md mx-4 animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4">
          <span className="text-white">Cambiar estado de:</span>{' '}
          <span className="text-[#00E57B]">{taskTitle}</span>
        </h3>
        
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              disabled={option.disabled}
              onClick={() => onStatusChange(option.value)}
              className={`w-full text-left text-white p-3 rounded-md transition-colors flex items-center
                ${option.disabled 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'hover:bg-opacity-20 text-white'}
                ${option.value === 'todo' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                ${option.value === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                ${option.value === 'done' ? 'bg-green-500 hover:bg-green-600' : ''}
                ${currentStatus === option.value ? 'ring-2 ring-white' : ''}`}
            >
              {getStatusIcon(option.value)}
              {option.label}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
