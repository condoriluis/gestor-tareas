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
              className={`w-full text-left text-white p-3 rounded-md transition-colors
                ${option.disabled 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'hover:bg-opacity-20 text-white'}
                ${option.value === 'todo' ? 'bg-gray-500' : ''}
                ${option.value === 'in_progress' ? 'bg-blue-500' : ''}
                ${option.value === 'done' ? 'bg-[#00E57B]' : ''}
                ${option.value === currentStatus ? 'bg-opacity-30' : 'bg-opacity-10'}`}
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
