import { useState } from 'react';

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#343434] rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-[#00E57B] mb-4">
          Cambiar estado de: {taskTitle}
        </h3>
        
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              disabled={option.disabled}
              onClick={() => onStatusChange(option.value)}
              className={`w-full text-left p-3 rounded-md transition-colors
                ${option.disabled 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'hover:bg-[#00E57B] hover:bg-opacity-20 text-white'}
                ${option.value === currentStatus ? 'bg-[#00E57B] bg-opacity-30' : ''}`}
            >
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
