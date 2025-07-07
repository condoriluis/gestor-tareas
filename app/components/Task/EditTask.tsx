import React, { useState } from "react";
import { MdOutlineSave } from "react-icons/md";
import { showToast } from "@/utils/toastMessages";
import { Task } from '@/utils/types';

interface EditTaskProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  onSuccess: (updatedTask: Task) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  id,
  title: initialTitle,
  description: initialDescription,
  priority: initialPriority,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast('El título no puede estar vacío.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('La descripción no puede estar vacía.', 'error');
      return;
    }

    let prioridad = "";
    if (priority.trim() === "low") {
      prioridad = "Baja";
    }
    if (priority.trim() === "medium") {
      prioridad = "Media";
    }
    if (priority.trim() === "high") {
      prioridad = "Alta";
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: 'edit', 
          title, 
          description, 
          priority,

          old_status: '',
          new_status: '',
          action_history: 'Tarea editada',
          description_history: title+' con prioridad: '+prioridad,
        }),
      });

      if (!response.ok) throw new Error('Error al editar tarea');

      const updatedTask = await response.json();
      if (response.ok) {
        showToast('Tarea actualizada correctamente', 'success');
        onSuccess(updatedTask);
        window.dispatchEvent(new Event('history-refresh'));
      }
    } catch (error) {
      showToast('No se pudo editar la tarea.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#343434] p-0 rounded-lg">
      <input
        type="text"
        placeholder="Escribe el título"
        value={title}
        onChange={(e) => 
          setTitle(e.target.value
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          )
        }
        className="w-full text-white p-2 mb-3 rounded bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
        autoFocus
      />
      <textarea
        placeholder="Escribe la descripción"
        value={description}
        onChange={(e) => 
          setDescription(e.target.value
            .charAt(0)
            .toUpperCase() + e.target.value.slice(1)
            .toLowerCase(), 
          )
        }
        className="w-full text-white p-2 mb-1 rounded bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
        rows={3}
      />
      <div className="flex gap-2 mb-4">
        {[
          { value: "low", label: "Baja", color: "bg-blue-500" },
          { value: "medium", label: "Media", color: "bg-yellow-500" },
          { value: "high", label: "Alta", color: "bg-red-500" },
        ].map(({ value, label, color }) => (
          <label
            key={value}
            className={`cursor-pointer px-4 py-1 rounded-lg flex items-center gap-2 transition-colors ${priority === value ? `${color} text-white shadow-md` : "bg-[#2A2A2A] text-gray-300"}`}
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

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-md bg-[#00E57B] text-white hover:bg-[#00C96B] transition-colors flex items-center gap-2 cursor-pointer"
          disabled={isLoading}
        >
          <MdOutlineSave size={18} />
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};

export default EditTask;
