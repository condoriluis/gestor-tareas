import { useState } from 'react';

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

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newTask.title.trim()) {
      setValidationError('El título es obligatorio.');
      return;
    }
    if (!newTask.description.trim()) {
      setValidationError('La descripción es obligatoria.');
      return;
    }
    if (!newTask.status) {
      setValidationError('El estado de la tarea es obligatorio.');
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
      {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
      <button
        className="text-white bg-teal-500 hover:bg-teal-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        onClick={handleAdd}
      >
        Guardar
      </button>
      <button
        onClick={onCancel}
        className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Cancelar
      </button>
    </div>
  );
};

export default AddTask;
