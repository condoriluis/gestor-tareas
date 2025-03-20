import React, { useState } from "react";
import { MdOutlineSave, MdClose } from "react-icons/md";
import { showToast } from "@/utils/toastMessages";

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

  const handleSave = () => {
    if (!title.trim()) {
      showToast('El título no puede estar vacío.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('La descripción no puede estar vacía.', 'error');
      return;
    }

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
      <hr className="border border-dashed mt-2"/>
      <div className="flex space-x-4"> 
        <button
          onClick={handleSave}
          className="text-teal-500 hover:text-teal-600 transition duration-300 cursor-pointer"
          aria-label="Guardar cambios"
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

export default EditTask;
