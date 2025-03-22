import { useState } from 'react';
import { MdClose, MdOutlineSave } from 'react-icons/md';
import { showToast } from "@/utils/toastMessages";

type Task = { id: number; title: string; description: string; priority: string; status: string };

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
    if (!newTask.status) {
      showToast('El estado de la tarea es obligatorio.', 'error');
      return;
    }

    onAddTask(newTask);
    setNewTask({ id: 0, title: '', description: '', priority: 'low', status: 'todo' });
  };

  return (
    <div className="bg-[#00E57B] text-white p-4 rounded shadow-lg">
      <input
        type="text"
        className="w-full p-1 mb-3 rounded focus:outline-none focus:ring focus:ring-white"
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
      <input
        type="text"
        className="w-full p-1 mb-3 rounded focus:outline-none focus:ring focus:ring-white"
        placeholder="Descripción"
        value={newTask.description}
        onChange={(e) => 
          setNewTask({ 
            ...newTask, 
            description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase(), 
          })
        }
      />
      <div className="flex gap-2 text-sm mb-3">
        {[
          { value: "low", label: "Baja", color: "bg-green-500" },
          { value: "medium", label: "Media", color: "bg-yellow-500" },
          { value: "high", label: "Alta", color: "bg-red-500" },
        ].map(({ value, label, color }) => (
          <label
            key={value}
            className={`cursor-pointer p-1 py-1 rounded flex items-center gap-2 border border-1 border-white ${
              newTask.priority === value ? `${color} text-white` : "bg-gray-200 text-gray-800"
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

      <hr className="border border-dashed mb-2"/>
     
      <div className="flex space-x-4"> 
        <button
          onClick={handleAdd}
          className="text-white hover:text-teal-600 transition duration-300 cursor-pointer"
          aria-label="Guardar"
        >
          <MdOutlineSave size={24} />
        </button>
        <button
          onClick={onCancel}
          className="text-white hover:text-red-600 transition duration-300 cursor-pointer"
          aria-label="Cancelar"
        >
          <MdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default AddTask;
