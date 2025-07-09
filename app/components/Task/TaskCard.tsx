import React, { useRef, useState } from "react";
import { useDrag } from 'react-dnd';
import EditTask from "./EditTask"
import { Task } from '@/utils/types'
import { formatDate } from '@/utils/dateService';
import { MdAccessTime , MdCancel, MdEdit, MdDelete, MdClose, MdInfo } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { showToast } from "@/utils/toastMessages";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => Promise<void>;
  onDeleteSuccess: (id: number) => void;
  onMobileStatusChange: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDeleteSuccess, onMobileStatusChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMobile = window.innerWidth <= 768;

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    if (isMobile) {
      const timer = setTimeout(() => {
        onMobileStatusChange(task);
      }, 500);
      setPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleLongPress = () => {
    if (isMobile) {
      onMobileStatusChange(task);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id_task: task.id_task, title_task: task.title_task, priority_task: task.priority_task, status_task: task.status_task, date_start_task: task.date_start_task},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !editMode,
  }), [editMode, task.id_task]);
  
  const ref = useRef<HTMLDivElement | null>(null);
  drag(ref);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id_task}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_status: '', new_status: '', action_history: 'Tarea eliminada', description_history: `${task.title_task} con ID: ${task.id_task}` }),
      });

      if (!response.ok) throw new Error('Error al eliminar tarea');
      
      window.dispatchEvent(new Event('history-refresh'));
      showToast('Tarea eliminada correctamente', 'success');
      onDeleteSuccess(task.id_task);
    } catch (error) {
      showToast('No se pudo eliminar la tarea.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  let duracion = null;
  if (
    task.status_task === "done" &&
    task.date_start_task &&
    task.date_completed_task
  ) {
    const inicio = new Date(task.date_start_task);
    const fin = new Date(task.date_completed_task);

    const diffMs = fin.getTime() - inicio.getTime(); 
    const diffMins = Math.floor(diffMs / 60000);
    const dias = Math.floor(diffMins / 1440);
    const horas = Math.floor((diffMins % 1440) / 60);
    const minutos = diffMins % 60;

    duracion = `${dias} días, ${horas} horas, ${minutos} minutos`;
  }

  return (
    <div
      ref={ref}
      className={`p-4 bg-[#343434] text-white rounded-lg shadow-lg ${
        isDragging ? "opacity-25 border border-[#00E57B] border-dotted" : ""
      } ${editMode ? "cursor-default" : "cursor-grab"}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleLongPress}
    >
      {editMode ? (
        <EditTask
          id={task.id_task}
          title={task.title_task}
          description={task.description_task}
          priority={task.priority_task}
          onSuccess={(updatedTask) => {
            onUpdate(updatedTask);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-[#00E57B]">{task.title_task}</h3>
          <p className="text-gray-600">{task.description_task}</p>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-500">Prioridad:</span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold shadow-md ${
                task.priority_task === "low"
                  ? "bg-green-100 text-[#3B82F6]"
                  : task.priority_task === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : task.priority_task === "high"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaCircle
                className={`mr-2 ${
                  task.priority_task === "low"
                    ? "text-[#3B82F6]"
                    : task.priority_task === "medium"
                    ? "text-yellow-500"
                    : task.priority_task === "high"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
                size={12}
              />
              {task.priority_task === "low"
                ? "Baja"
                : task.priority_task === "medium"
                ? "Media"
                : task.priority_task === "high"
                ? "Alta"
                : "Sin especificar"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Estado:</span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
                task.status_task === "todo"
                  ? "bg-gray-100 text-gray-600"
                  : task.status_task === "in_progress"
                  ? "bg-blue-100 text-blue-600"
                  : task.status_task === "done"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {task.status_task === "todo"
                ? "To-do"
                : task.status_task === "in_progress"
                ? "En progreso"
                : task.status_task === "done"
                ? "Completado"
                : "Sin especificar"}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm">
            <span className="text-gray-500 font-medium">Creado por:</span>
            <p className="text-gray-700 font-semibold">{task.user_name}</p>
          </div>

          <div className="flex items-center space-x-2 mt-1 text-sm">
            <span className="text-gray-500 font-medium">Creado el:</span>
            <p className="text-gray-700 font-semibold">{formatDate(task.date_created_task)}</p>
          </div>

          {task.status_task === "in_progress" && (
            <div className="flex items-center space-x-2 mt-1 text-sm">
              <span className="text-gray-500 font-medium">Iniciado el:</span>
              <p className="text-gray-700 font-semibold">{formatDate(task.date_start_task)}</p>
            </div>
          )}

          {task.status_task === "done" && (
            <>
            <div className="flex items-center space-x-2 mt-1 text-sm">
              <span className="text-gray-500 font-medium">Iniciado el:</span>
              <p className="text-gray-700 font-semibold">{formatDate(task.date_start_task)}</p>
            </div>

            <div className="flex items-center space-x-2 mt-1 text-sm">
              <span className="text-gray-500 font-medium">Completado el:</span>
              <p className="text-gray-700 font-semibold">{formatDate(task.date_completed_task)}</p>
            </div>
            </>
          )}

          <hr className="border border-dashed border-gray-400 mt-1 mb-3"/>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <button
                onClick={() => setEditMode(true)}
                className="text-[#00E57B] hover:text-teal-600 transition duration-300 cursor-pointer"
                aria-label="Editar tarea"
              >
                <MdEdit size={24} />
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 hover:text-red-600 transition duration-300 cursor-pointer"
                aria-label="Eliminar tarea"
              >
                <MdDelete size={24} />
              </button>

            </div>

            {task.status_task === "done" && duracion && (
              <div className="flex items-center text-sm text-gray-300">
                <MdAccessTime size={18} className="mr-1" />
                <span>{duracion}</span>
              </div>
            )}
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
              <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-white">
                    <MdCancel className="inline-block text-red-500 mr-2" />
                    Confirmar eliminación
                  </h4>
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <MdClose size={24} />
                  </button>
                </div>
                
                <p className="text-gray-300 mb-6">
                  ¿Estás seguro de eliminar la tarea <b className="text-gray-300">{task.title_task}</b>?
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
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
                        Eliminar tarea
                      </>
                    )}
                    
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
