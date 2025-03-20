import React, { useState } from "react";

interface EditTaskProps {
  title: string;
  description: string;
  status: string;
  onSave: (title: string, description: string, status: string) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  title: initialTitle,
  description: initialDescription,
  status: initialStatus,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción no puede estar vacía.");
      return;
    }

    setError(null);
    onSave(title, description, status);
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-gray-800 p-0 mb-0 rounded focus:outline-none focus:ring focus:ring-teal-400"
        autoFocus
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full text-gray-800 p-0 mb-0 rounded focus:outline-none focus:ring focus:ring-teal-400"
      />
      <select
        className="w-full text-gray-800 p-0 mb-3 rounded focus:outline-none focus:ring focus:ring-teal-400"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="done">Completada</option>
      </select>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
        onClick={handleSave}
      >
        Guardar
      </button>
      <button
        onClick={onCancel}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancelar
      </button>
    </div>
  );
};

export default EditTask;
