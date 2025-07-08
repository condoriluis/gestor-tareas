'use client';

import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { showToast } from "@/utils/toastMessages";
import { DateTime } from 'luxon';
import { Task } from '@/utils/types'
import TaskCard from './TaskCard';
import AddTask from './AddTask';
import { FilterModal } from './FilterModal';
import { ReportModal } from './ReportModal';
import Navbar from '../Navbar';
import Historial from '../Historial';
import { MdClose, MdArrowBack, MdInfoOutline } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTaskUser } from '@/app/context/TaskUserContext';
import ConfirmModal from './ConfirmModal';

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { userId, userName, setUserId } = useTaskUser();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    taskId: number;
    newStatus: string;
    title: string;
    priority: string;
    status_old: string;
    date_start_old: string;
  } | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = userId ? `/api/tasks/${userId}` : '/api/tasks';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener tareas.');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        showToast('Error al cargar la tarea.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, [userId]);

  const handleCreateTask = async (task: Task) => {
    setTasks(prevTasks => [task, ...prevTasks]);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id_task === updatedTask.id_task ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id_task !== id)); 
  };

  const handleStatusChange = async (taskId: number, newStatus: string, title: string, priority: string, status_old: string, date_start_old: string) => {
    if (status_old === 'todo' && newStatus === 'done') {
      showToast('No puedes marcar como completada una tarea que no ha comenzado', 'error');
      return;
    }
    
    if (newStatus === 'in_progress') {
      setConfirmTitle('Confirmar inicio de tarea');
      setConfirmMessage(`¿Estás seguro de iniciar la tarea "${title}"?`);
      setPendingStatusChange({ taskId, newStatus, title, priority, status_old, date_start_old });
      setShowConfirmModal(true);
      return;
    }
    
    if (newStatus === 'done') {
      setConfirmTitle('Confirmar completado');
      setConfirmMessage(`¿Estás seguro de marcar como completada la tarea "${title}"?`);
      setPendingStatusChange({ taskId, newStatus, title, priority, status_old, date_start_old });
      setShowConfirmModal(true);
      return;
    }

    // Para otros estados (todo) no requiere confirmación
    await processStatusChange(taskId, newStatus, title, priority, status_old, date_start_old);
  };

  const processStatusChange = async (taskId: number, newStatus: string, title: string, priority: string, status_old: string, date_start_old: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id_task === taskId ? { ...task, status_task: newStatus, title_task: title, priority_task: priority } : task
      )
    );
  
    let dateStart = '';
    let dateCompleted = '';
    let prioridad = '';

    if (newStatus === 'todo') {
      dateStart = '';
      dateCompleted = '';
    }

    if (newStatus === 'in_progress') {
      dateStart = DateTime.now().setZone('America/La_Paz').toFormat('yyyy-MM-dd HH:mm:ss');
      dateCompleted = '';
    }

    if (newStatus === 'done') {
      dateStart = date_start_old.includes('T') ? 
        DateTime.fromISO(date_start_old).setZone('America/La_Paz').toFormat('yyyy-MM-dd HH:mm:ss') : 
        date_start_old;
      dateCompleted = DateTime.now().setZone('America/La_Paz').toFormat('yyyy-MM-dd HH:mm:ss');
    }

    if (priority === 'low') {
      prioridad = 'Baja';
    }
    if (priority === 'medium') {
      prioridad = 'Media';
    }
    if (priority === 'high') {
      prioridad = 'Alta';
    }

    const taskData = {
      status: newStatus,
      title,
      priority,
      date_start: dateStart,
      date_completed: dateCompleted,
      old_status: status_old,
      new_status: newStatus,
      action_history: 'Estado cambiado',
      description_history: `Tarea: ${title} con prioridad: ${prioridad}`
    };

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: 'status',
          ...taskData
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      window.dispatchEvent(new Event('history-refresh'));
      showToast('Estado actualizado correctamente', 'success');

      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id_task === taskId ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      showToast('No se pudo actualizar el estado.', 'error');
    }
  };

  const statuses = [
    { key: "todo", label: "To-do", color: "border-gray-500" },
    { key: "in_progress", label: "En progreso", color: "border-blue-500" },
    { key: "done", label: "Completado", color: "border-green-500" },
  ];

  const filteredTasks = tasks.filter(task => {
    
    if (activeFilter && task.priority_task !== activeFilter) {
      return false;
    }
    
    if (searchTerm && 
      !task.title_task.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !task.description_task.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar 
        user={user}
        tasks={tasks}
        onSearch={(term) => setSearchTerm(term)}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAddTaskModal={() => setIsModalOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          {userId && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setUserId(null)}
                    className="flex items-center gap-1 p-2 rounded-lg border border-gray-700 bg-[#00E57B] hover:bg-green-500 transition-colors"
                    aria-label="Volver a mis tareas"
                  >
                    <MdArrowBack size={20} className="text-white cursor-pointer" />
                    <span className="text-sm text-white hidden md:inline cursor-pointer">Volver</span>
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="text-gray-400">Tareas de: </span>
                    <span className="text-[#00E57B]">{userName || ''}</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MdInfoOutline size={16} />
                <span>Viendo tareas específicas de este usuario</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {activeFilter && (
              <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-sm text-white">
                  Filtro por prioridad: {activeFilter === 'low' ? 'Baja' : activeFilter === 'medium' ? 'Media' : 'Alta'}
                </span>
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="text-gray-300 hover:text-white"
                >
                  <MdClose size={16} className="cursor-pointer"/>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statuses.map(({ key, label, color }) => {
              const [, drop] = useDrop(() => ({
                accept: "TASK",
                drop: (item: Task) => handleStatusChange(item.id_task, key, item.title_task, item.priority_task, item.status_task, item.date_start_task),
              }));

              const ref = useRef<HTMLDivElement | null>(null);
              drop(ref);

              return (
                <div
                  key={key}
                  ref={ref}
                  className={`bg-[#2A2A2A] p-4 rounded-lg border-2 ${color} shadow-lg`}
                >
                  <h2 className="text-lg font-semibold text-white text-center mb-4">{label}</h2>
                  <div className="space-y-3">
                    {filteredTasks
                      .filter(task => task.status_task === key)
                      .map(task => (
                        <TaskCard 
                          key={task.id_task} 
                          task={task} 
                          onUpdate={handleUpdateTask} 
                          onDeleteSuccess={handleDeleteTask} 
                        />
                      ))}

                    {filteredTasks
                      .filter(task => task.status_task === key)
                      .length === 0 && (
                        <p className="text-center text-gray-400">Sin tareas</p>
                      )}
                  </div>
                </div>
              );
            })}
            
          </div>

          {isModalOpen && (
            <AddTask 
              onCreate={handleCreateTask}
              onCancel={() => setIsModalOpen(false)} 
            />
          )}

          <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tasks={tasks}
          />

          <ReportModal 
            isOpen={isReportModalOpen} 
            onClose={() => setIsReportModalOpen(false)}
            tasks={tasks}
          />

        </main>
        
        <Historial user={user} />
      </div>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          if (pendingStatusChange) {
            processStatusChange(
              pendingStatusChange.taskId,
              pendingStatusChange.newStatus,
              pendingStatusChange.title,
              pendingStatusChange.priority,
              pendingStatusChange.status_old,
              pendingStatusChange.date_start_old
            );
          }
          setShowConfirmModal(false);
        }}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Confirmar"
      />
    </div>
  );
};

export default TaskList;
