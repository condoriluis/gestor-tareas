import { useState } from 'react';
import { MdClose, MdOutlineSave } from 'react-icons/md';
import { showToast } from "@/utils/toastMessages";
import { Task } from '@/utils/types'

interface AddTaskProps {
  onCreate: (task: Task) => Promise<void>;
  onCancel: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onCreate, onCancel }) => {
  const [newTask, setNewTask] = useState<Task>({
    id_task: 0,
    id_user_task: 0,
    user_name: '',
    title_task: '',
    description_task: '',
    priority_task: 'low',
    status_task: 'todo',
    date_start_task: null,
    date_completed_task: null,
    date_created_task: ''
  });

  const handleCreateTask = async () => {
    if (!newTask.title_task.trim()) {
      showToast('El título es obligatorio.', 'error');
      return;
    }
    if (!newTask.description_task.trim()) {
      showToast('La descripción es obligatoria.', 'error');
      return;
    }

    let priority = "";
    if (newTask.priority_task.trim() === "low") {
      priority = "Baja";
    }
    if (newTask.priority_task.trim() === "medium") {
      priority = "Media";
    }
    if (newTask.priority_task.trim() === "high") {
      priority = "Alta";
    }

    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_task: newTask.title_task,
          description_task: newTask.description_task,
          priority_task: newTask.priority_task,
          status_task: newTask.status_task,
          date_start_task: newTask.date_start_task,
          date_completed_task: newTask.date_completed_task,
  
          old_status: '',
          new_status: '',
          action_history: 'Tarea creada',
          description_history: newTask.title_task+' con prioridad: '+priority,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Tarea creada correctamente.', 'success');
        onCancel();
        window.dispatchEvent(new Event('history-refresh'));
      } else {
        throw new Error('Error en la creación');
      }

      await onCreate(data);
      setNewTask({ 
        id_task: 0, 
        id_user_task: 0, 
        user_name: '', 
        title_task: '', 
        description_task: '', 
        priority_task: 'low', 
        status_task: 'todo', 
        date_start_task: null,
        date_completed_task: null,
        date_created_task: '',
      });
    } catch (error) {
      showToast('No se pudo crear la tarea.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-[#2A2A2A] border border-gray-700 rounded-xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Nueva Tarea</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
        
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#343434] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B] focus:border-transparent transition-all"
              placeholder="Escribe el título"
              autoFocus
              value={newTask.title_task}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title_task: e.target.value
                    .toLowerCase()
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
            <textarea
              className="w-full p-3 rounded-lg bg-[#343434] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B] focus:border-transparent transition-all min-h-[100px]"
              placeholder="Describe la tarea"
              value={newTask.description_task}
              onChange={(e) => 
                setNewTask({ 
                  ...newTask, 
                  description_task: e.target.value, 
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Prioridad</label>
            <div className="flex gap-2">
              {[
                { value: "low", label: "Baja", color: "bg-blue-500 hover:bg-blue-600" },
                { value: "medium", label: "Media", color: "bg-yellow-500 hover:bg-yellow-600" },
                { value: "high", label: "Alta", color: "bg-red-500 hover:bg-red-600" },
              ].map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`cursor-pointer px-4 py-1 rounded-lg flex items-center gap-2 transition-colors ${
                    newTask.priority_task === value 
                      ? `${color} text-white shadow-md` 
                      : "bg-[#343434] text-gray-300 hover:bg-[#3E3E3E]"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={newTask.priority_task === value}
                    onChange={(e) => setNewTask({ ...newTask, priority_task: e.target.value })}
                    className="hidden"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 text-sm rounded-md bg-[#00E57B] text-white hover:bg-[#00C96B] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MdOutlineSave size={18} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
