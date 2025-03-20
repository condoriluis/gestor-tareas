import { useState } from 'react';
import { MdClose, MdOutlineSave } from 'react-icons/md';
import { showToast } from "@/utils/toastMessages";

type Task = { id: number; title: string; description: string; status: string };

interface AddTaskProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask, onCancel }) => {
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    status: 'pending',
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
    setNewTask({ id: 0, title: '', description: '', status: 'pending' });
  };

  return (
    <div className="bg-white border-2 border-dashed border-teal-300 p-4 rounded shadow-lg">
      <input
        type="text"
        className="w-full text-gray-800 p-0 mb-0 rounded focus:outline-none focus:ring focus:ring-teal-400"
        placeholder="Título"
        autoFocus
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        type="text"
        className="w-full text-gray-800 p-0 mb-0 rounded focus:outline-none focus:ring focus:ring-teal-400"
        placeholder="Descripción"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <select
        className="w-full text-gray-800 p-0 mb-2 rounded focus:outline-none focus:ring focus:ring-teal-400"
        value={newTask.status}
        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
      >
        <option value="pending">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="done">Completada</option>
      </select>
      <hr className="border border-dashed mt-2"/>
     
      <div className="flex space-x-4"> 
        <button
          onClick={handleAdd}
          className="text-teal-500 hover:text-teal-600 transition duration-300 cursor-pointer"
          aria-label="Guardar"
        >
          <MdOutlineSave size={24} />
        </button>
        <button
          onClick={onCancel}
          className="text-red-500 hover:text-red-600 transition duration-300 cursor-pointer"
          aria-label="Cancelar"
        >
          <MdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default AddTask;
