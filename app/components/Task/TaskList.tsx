'use client';

import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { showToast } from "@/utils/toastMessages";
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
import { StatusChangeModal } from './StatusChangeModal';

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
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    taskId: number;
    newStatus: string;
    title: string;
    priority: string;
    status_old: string;
  } | null>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

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

  const handleStatusChange = async (taskId: number, newStatus: string, title: string, priority: string, status_old: string) => {
    if (status_old === 'todo' && newStatus === 'done') {
      showToast('No puedes marcar como completada una tarea que no ha comenzado', 'error');
      return;
    }
    
    if (newStatus === 'in_progress') {
      setConfirmTitle('Confirmar inicio de tarea');
      setConfirmMessage(`¿Estás seguro de iniciar la tarea "${title}"?`);
      setPendingStatusChange({ taskId, newStatus, title, priority, status_old });
      setShowConfirmModal(true);
      return;
    }
    
    if (newStatus === 'done') {
      setConfirmTitle('Confirmar completado');
      setConfirmMessage(`¿Estás seguro de marcar como completada la tarea "${title}"?`);
      setPendingStatusChange({ taskId, newStatus, title, priority, status_old });
      setShowConfirmModal(true);
      return;
    }

    await processStatusChange(taskId, newStatus, title, priority, status_old);
  };

  const handleMobileStatusChange = (task: Task) => {
    setCurrentTask(task);
    setShowStatusModal(true);
  };

  const handleStatusChangeMobile = async (newStatus: string) => {
    if (!currentTask) return;
    
    if (currentTask.status_task === 'todo' && newStatus === 'done') {
      showToast('No puedes marcar como completada una tarea que no ha comenzado', 'error');
      setShowStatusModal(false);
      return;
    }
    
    if ((currentTask.status_task === 'todo' && newStatus === 'in_progress') || 
        (currentTask.status_task === 'in_progress' && newStatus === 'done')) {
      const action = newStatus === 'in_progress' ? 'comenzar' : 'completar';
      setConfirmTitle(`Confirmar ${action} tarea`);
      setConfirmMessage(`¿Estás seguro que deseas ${action} la tarea "${currentTask.title_task}"?`);
      setPendingStatusChange({
        taskId: currentTask.id_task,
        newStatus,
        title: currentTask.title_task,
        priority: currentTask.priority_task,
        status_old: currentTask.status_task
      });
      setShowConfirmModal(true);
      setShowStatusModal(false);
      return;
    }
    
    await processStatusChange(
      currentTask.id_task,
      newStatus,
      currentTask.title_task,
      currentTask.priority_task,
      currentTask.status_task || ''
    );
    setShowStatusModal(false);
  };

  const processStatusChange = async (taskId: number, newStatus: string, title: string, priority: string, status_old: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id_task === taskId ? { ...task, status_task: newStatus, title_task: title, priority_task: priority, status_old } : task
      )
    );
  
    

    try {
      const response = await fetch(`/api/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, newStatus }),
      });

      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      window.dispatchEvent(new Event('history-refresh'));
      showToast('Estado actualizado correctamente.', 'success');

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
        <main className="flex-1 p-4 h-[calc(100vh-64px)] md:p-6 overflow-y-auto scrollbar-custom">
          <div className="md:hidden flex items-center justify-center text-sm text-gray-400">
            <MdInfoOutline className="mr-1" />
            <span>Pulsa una tarea para cambiar su estado</span>
          </div>

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
                drop: (item: Task) => handleStatusChange(item.id_task, key, item.title_task, item.priority_task, item.status_task || ''),
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
                          onMobileStatusChange={handleMobileStatusChange}
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

          {showStatusModal && currentTask && (
            <StatusChangeModal
              taskTitle={currentTask.title_task}
              options={[
                { label: 'Mover a TODO', value: 'todo', disabled: currentTask.status_task === 'todo' },
                { label: 'Mover a EN PROGRESO', value: 'in_progress', disabled: currentTask.status_task === 'in_progress' },
                { label: 'Mover a COMPLETADO', value: 'done', disabled: currentTask.status_task === 'done' }
              ]}
              currentStatus={currentTask.status_task || ''}
              onClose={() => setShowStatusModal(false)}
              onStatusChange={handleStatusChangeMobile}
            />
          )}
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
              pendingStatusChange.status_old
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
