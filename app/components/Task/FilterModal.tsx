import { MdClose, MdCheckCircle } from "react-icons/md";
import { useState, useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tasks: any[];
};

export const FilterModal = ({ 
  isOpen, 
  onClose, 
  activeFilter, 
  setActiveFilter,
  searchTerm,
  setSearchTerm,
  tasks
}: FilterModalProps) => {
  const [, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleFilterChange = (priority: string) => {
    if (priority === 'all') {
      setActiveFilter(null);
    } else {
      setActiveFilter(priority);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-[#2A2A2A] p-6 rounded-lg w-full max-w-md animate-fade-in-up border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Filtrar Tareas por prioridad</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
          >
            <MdClose size={24} />
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          {['low', 'medium', 'high', 'all'].map((priority) => {
            const priorityStyles: Record<'low' | 'medium' | 'high' | 'all', string> = {
              low: 'border-l-4 border-blue-400 bg-[#343434] hover:bg-[#3a3a3a]',
              medium: 'border-l-4 border-yellow-400 bg-[#343434] hover:bg-[#3a3a3a]',
              high: 'border-l-4 border-red-400 bg-[#343434] hover:bg-[#3a3a3a]',
              all: 'border-l-4 border-gray-400 bg-[#343434] hover:bg-[#3a3a3a]'
            };

            const priorityLabels: Record<'low' | 'medium' | 'high' | 'all', string> = {
              low: 'Baja',
              medium: 'Media',
              high: 'Alta',
              all: 'Todas'
            };

            return (
              <button
                key={priority}
                onClick={() => handleFilterChange(priority)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-r-lg text-white transition-all cursor-pointer ${priorityStyles[priority as 'low' | 'medium' | 'high' | 'all']} ${(activeFilter === priority || (priority === 'all' && !activeFilter)) ? 'bg-[#3a3a3a]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${priority === 'low' ? 'bg-blue-400' : priority === 'medium' ? 'bg-yellow-400' : priority === 'high' ? 'bg-red-400' : 'bg-gray-400'}`} />
                  <span>{priorityLabels[priority as 'low' | 'medium' | 'high' | 'all']}</span>
                </div>
                {(activeFilter === priority || (priority === 'all' && !activeFilter)) && 
                  <MdCheckCircle size={20} className="text-[#00E57B]" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
