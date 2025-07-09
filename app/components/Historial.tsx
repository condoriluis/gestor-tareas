'use client';

import { showToast } from '@/utils/toastMessages';
import { useState, useEffect } from 'react';
import { FiClock, FiX, FiUser, FiChevronRight, FiChevronLeft, FiPlusCircle, FiEdit2, FiRefreshCw, FiActivity, FiDelete, FiSearch, FiTrash2 } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { TaskHistory } from '@/utils/types';
import { useTaskUser } from '@/app/context/TaskUserContext';

type UserType = {
  id_user?: number;
  name_user?: string;
  rol_user?: string;
};

type HistorialProps = {
  user: UserType | null;
};

export default function Historial({ user }: HistorialProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const {userId} = useTaskUser();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    
    const isDesktop = window.innerWidth >= 768;
    setIsOpen(isDesktop);
    setIsInitialized(true);
    
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleHistorial = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const targetUserId = userId || user?.id_user;
        if (!targetUserId) return;
        
        const url = `/api/history/${targetUserId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener historial de actividades.');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (isOpen && isInitialized) {
      fetchHistory();
    }
  }, [user?.id_user, userId, isOpen, isInitialized]);

  const formatHistoryDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    
    const timeFormat = new Intl.DateTimeFormat('es', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true
    });
    
    const formattedTime = timeFormat.format(date)
      .replace('a. m.', 'AM')
      .replace('p. m.', 'PM');
    
    if (inputDate.getTime() === today.getTime()) return `Hoy, ${formattedTime}`;
    if (inputDate.getTime() === yesterday.getTime()) return `Ayer, ${formattedTime}`;
    
    const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
    return `Hace ${diffDays} días, ${formattedTime}`;
  };

  const getHistoryType = (action: string) => {
    if (action.includes('Tarea creada')) return 'creation';
    if (action.includes('Tarea editada')) return 'edition';
    if (action.includes('Tarea eliminada')) return 'deletion';
    if (action.includes('Estado cambiado')) return 'status-change';
    return 'default';
  };

  const getTypeColor = (action: string) => {
    const type = getHistoryType(action);
    switch(type) {
      case 'creation': return 'border-l-blue-500';
      case 'edition': return 'border-l-orange-500';
      case 'deletion': return 'border-l-red-500';
      case 'status-change': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  const translateStatus = (status: string) => {
    switch(status) {
      case 'todo': return 'To-do';
      case 'in_progress': return 'En progreso';
      case 'done': return 'Completado';
      default: return status;
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.description_history.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
      (filterType === 'creation' && item.action_history.includes('Tarea creada')) ||
      (filterType === 'edition' && item.action_history.includes('Tarea editada')) ||
      (filterType === 'status-change' && item.action_history.includes('Estado cambiado')) ||
      (filterType === 'deletion' && item.action_history.includes('Tarea eliminada'));
    
    return matchesSearch && matchesType;
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirmation = (id_history?: number) => {
    setDeleteItemId(id_history || null);
    setShowDeleteDialog(true);
  };

  const handleDeleteHistory = async () => {
    setIsDeleting(true);
    try {
      const targetUserId = userId || user?.id_user;
      if (!targetUserId) return;
      
      const url = deleteItemId 
        ? `/api/history/${targetUserId}?id_history=${deleteItemId}`
        : `/api/history/${targetUserId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error();
      
      const data = await response.json();
      setHistory(prev => deleteItemId 
        ? prev.filter(item => item.id_history !== deleteItemId)
        : []);
      
      showToast(data.message || (deleteItemId 
        ? 'Elemento del historial eliminado exitosamente' 
        : 'Historial completo eliminado exitosamente'), 'success');
    } catch (error) {
      showToast(deleteItemId 
        ? 'Error al eliminar el elemento del historial' 
        : 'Error al eliminar el historial completo', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteItemId(null);
    }
  };

  return (
    <>
      <button
        onClick={toggleHistorial}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed right-4 top-1/2 z-50 p-2 rounded-full bg-[#2A2A2A] shadow-lg
          transition-all duration-300 ease-in-out transform
          ${isOpen ? 'translate-x-[calc(18rem-1rem)] lg:translate-x-[calc(16rem-1rem)]' : 'translate-x-0'}
          hover:bg-[#00E57B] hover:scale-110
          ${isHovered ? 'opacity-100' : 'opacity-70'}
          lg:block
        `}
        aria-label={isOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
      >
        {isOpen ? 
          <FiChevronRight className="text-white" size={20} /> : 
          <FiChevronLeft className="text-white" size={20} />
        }
      </button>

      <aside className={`
        fixed top-0 right-0 h-full bg-[#242424] shadow-2xl z-40
        transition-all duration-300 ease-in-out rounded-b-lg
        ${isOpen ? 'w-80 translate-x-0 lg:w-95' : 'w-0 translate-x-full'}
        lg:relative lg:translate-x-0 lg:border-l lg:border-gray-700
      `}>
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-[#1E1E1E]">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {isOpen ? 'Historial de actividades' : ''}
          </h3>
          <button 
            onClick={toggleHistorial}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label={isOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto scrollbar-custom p-4">
          {isOpen && (
            <>
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar en historial..."
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-3 top-3 flex items-center space-x-2">
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-gray-400 hover:text-white"
                      >
                        <MdClose size={18} />
                      </button>
                    )}
                    <FiSearch className="text-gray-400" />
                  </div>
                </div>
                <div className='flex-1 overflow-hidden'>
                  <div className="flex overflow-x-auto scrollbar-custom pb-2 mb-2 gap-2">
                    {['all', 'creation', 'edition', 'status-change', 'deletion'].map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${filterType === type 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#333333]'
                        }`}
                        onClick={() => setFilterType(type)}
                      >
                        {type === 'all' ? 'Todos' : 
                        type === 'creation' ? 'Creaciones' : 
                        type === 'edition' ? 'Ediciones' : 
                        type === 'status-change' ? 'Estados' : 'Eliminaciones'}
                      </button>
                    ))}
                  </div>
                  {history.length > 0 && user?.rol_user === 'admin' && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteConfirmation()}
                        className="px-3 py-1 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-1 cursor-pointer"
                        title="Eliminar todo el historial"
                      >
                        <FiDelete size={14} />
                        Limpiar el historial
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div 
                      key={item.id_history}
                      className={`bg-[#2A2A2A] p-4 rounded-lg border-l-4 ${getTypeColor(item.action_history)}
                        hover:bg-[#333333] transition-all duration-200
                        shadow-md hover:shadow-lg`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getHistoryType(item.action_history) === 'creation' && <FiPlusCircle className="text-blue-400" size={18} />}
                          {getHistoryType(item.action_history) === 'edition' && <FiEdit2 className="text-orange-400" size={18} />}
                          {getHistoryType(item.action_history) === 'deletion' && <FiDelete className="text-red-400" size={18} />}
                          {getHistoryType(item.action_history) === 'status-change' && <FiRefreshCw className="text-purple-400" size={18} />}
                          {getHistoryType(item.action_history) === 'default' && <FiActivity className="text-gray-400" size={18} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs">
                            <FiClock size={12} className="text-gray-500" />
                            <span>{formatHistoryDate(item.date_created_history)}</span>
                          </div>
                          <div className="mb-2">
                            {item.action_history === 'Estado cambiado' ? (
                              <>
                                <p className="text-white font-medium">
                                  <b className="text-gray-400">{item.action_history}</b> 
                                  <br />
                                  <b className="text-gray-400">'{translateStatus(item.old_status_history)}'</b> → <b className="text-gray-400">'{translateStatus(item.new_status_history)}'</b>
                                  <br />
                                  {item.description_history}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-white font-medium">
                                  <b className="text-gray-400">{item.action_history}</b> 
                                  <br />
                                  {item.description_history}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <FiUser size={12} />
                              <span>por {item.user_name}</span>
                            </div>
                            {user?.rol_user === 'admin' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConfirmation(item.id_history);
                              }}
                              className="text-red-400 hover:text-red-500 text-xs flex items-center gap-1 cursor-pointer"
                              title="Eliminar el historial"
                            >
                              <FiDelete size={12} />
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FiClock size={32} className="mb-2" />
                    <p className="text-center">No se encontraron actividades</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </aside>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
          <div className="bg-[#2A2A2A] rounded-lg p-6 max-w-md w-full shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">
                {deleteItemId ? 'Confirmar eliminación' : 'Confirmar eliminación completa'}
              </h3>
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              {deleteItemId 
                ? '¿Está seguro que desea eliminar permanentemente este registro del historial? Esta acción no se puede deshacer.'
                : '¿Está seguro que desea eliminar permanentemente todo el historial? Todos los registros serán eliminados de forma irreversible.'}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteHistory}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    {deleteItemId ? 'Eliminar registro' : 'Eliminar todo'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
