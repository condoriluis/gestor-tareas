import React, { useState } from "react";
import { MdOutlineSave, MdClose } from "react-icons/md";
import { showToast } from "@/utils/toastMessages";

interface EditTaskProps {
  title: string;
  description: string;
  priority: string;

  onSave: (title: string, description: string, priority: string) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  title: initialTitle,
  description: initialDescription,
  priority: initialPriority,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);

  const handleSave = () => {
    if (!title.trim()) {
      showToast('El título no puede estar vacío.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('La descripción no puede estar vacía.', 'error');
      return;
    }

    onSave(title, description, priority);
  };

  return (
    
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => 
          setTitle(e.target.value
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          )
        }
        className="w-full text-white p-1 mb-3 rounded focus:outline-none focus:ring focus:ring-[#00E57B]"
        autoFocus
      />
      <input
        type="text"
        value={description}
        onChange={(e) => 
          setDescription(e.target.value
            .charAt(0)
            .toUpperCase() + e.target.value.slice(1)
            .toLowerCase(), 
          )
        }
        className="w-full text-white p-1 mb-3 rounded focus:outline-none focus:ring focus:ring-[#00E57B]"
      />
      <div className="flex gap-2 text-sm mb-3">
        {[
          { value: "low", label: "Baja", color: "bg-green-500" },
          { value: "medium", label: "Media", color: "bg-yellow-500" },
          { value: "high", label: "Alta", color: "bg-red-500" },
        ].map(({ value, label, color }) => (
          <label
            key={value}
            className={`cursor-pointer p-1 py-1 rounded flex items-center gap-2 border border-white transition-all ${
              priority === value ? `${color} text-white` : "bg-gray-200 text-gray-800"
            }`}
          >
            <input
              type="radio"
              name="priority"
              value={value}
              checked={priority === value}
              onChange={(e) => setPriority(e.target.value)}
              className="hidden"
            />
            {label}
          </label>
        ))}
      </div>

      <hr className="border border-dashed mb-2"/>
      <div className="flex space-x-4"> 
        <button
          onClick={handleSave}
          className="text-white hover:text-teal-600 transition duration-300 cursor-pointer"
          aria-label="Guardar cambios"
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

export default EditTask;
