import { useState } from 'react';
import { MdClose, MdOutlineSave } from 'react-icons/md';
import { showToast } from "@/utils/toastMessages";
import { Task } from '@/utils/types'

interface AddTaskProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask, onCancel }) => {
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    priority: 'low',
    status: 'todo',
    created_at: ''
  });

  const handleAdd = () => {
    if (!newTask.title.trim()) {
      showToast('El título es obligatorio.', 'error');
      return;
    }
    if (!newTask.description.trim()) {
      showToast('La descripción es obligatoria.', 'error');
      return;
    }

    onAddTask(newTask);
    setNewTask({ id: 0, title: '', description: '', priority: 'low', status: 'todo', created_at: '' });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Nueva Tarea</h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <MdClose size={24} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-[#343434] text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
            placeholder="Título"
            autoFocus
            value={newTask.title}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                title: e.target.value
                  .toLowerCase()
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
              })
            }
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
          <textarea
            className="w-full p-2 rounded bg-[#343434] text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
            placeholder="Descripción"
            rows={3}
            value={newTask.description}
            onChange={(e) => 
              setNewTask({ 
                ...newTask, 
                description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase(), 
              })
            }
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Prioridad</label>
          <div className="flex gap-2">
            {[
              { value: "low", label: "Baja", color: "bg-green-500" },
              { value: "medium", label: "Media", color: "bg-yellow-500" },
              { value: "high", label: "Alta", color: "bg-red-500" },
            ].map(({ value, label, color }) => (
              <label
                key={value}
                className={`cursor-pointer px-3 py-1 rounded flex items-center gap-2 ${
                  newTask.priority === value ? `${color} text-white` : "bg-[#343434] text-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={newTask.priority === value}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-[#343434] text-gray-300 hover:bg-[#404040]"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-[#00E57B] text-white hover:bg-[#00C96B] flex items-center gap-2"
          >
            <MdOutlineSave size={18} />
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default AddTask;
