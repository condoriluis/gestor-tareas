import React, { useState } from "react";
import EditTask from "./EditTask";
import { MdCheckCircle, MdCancel, MdEdit, MdDelete } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

type Task = { id: number; title: string; description: string; priority: string; status: string; };

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, title: string, description: string, priority: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-[#343434] p-4 rounded shadow-lg">
      {editMode ? (
        <EditTask
          title={task.title}
          description={task.description}
          priority={task.priority}
          onSave={(title, description, priority) => {
            onUpdate(task.id, title, description, priority);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-[#00E57B]">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-500">Prioridad:</span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold shadow-md ${
                task.priority === "low"
                  ? "bg-green-100 text-green-700"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaCircle
                className={`mr-2 ${
                  task.priority === "low"
                    ? "text-green-500"
                    : task.priority === "medium"
                    ? "text-yellow-500"
                    : task.priority === "high"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
                size={12}
              />
              {task.priority === "low"
                ? "Baja"
                : task.priority === "medium"
                ? "Media"
                : task.priority === "high"
                ? "Alta"
                : "Sin especificar"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Estado:</span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
                task.status === "todo"
                  ? "bg-gray-100 text-gray-600"
                  : task.status === "pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : task.status === "in_progress"
                  ? "bg-blue-100 text-blue-600"
                  : task.status === "done"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {task.status === "todo"
                ? "To-do"
                : task.status === "pending"
                ? "Pendiente"
                : task.status === "in_progress"
                ? "En Progreso"
                : task.status === "done"
                ? "Completado"
                : "Sin especificar"}
            </span>
          </div>

          <hr className="border border-dashed mt-3 mb-3"/>
          
          <div className="flex space-x-4">
        
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

          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h4 className="text-xl font-semibold text-center text-gray-700 mb-4">
                  <MdCancel className="inline-block text-red-500 mr-2" />
                  ¿Estás seguro de eliminar la tarea "{task.title}"?
                </h4>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                    aria-label="Cancelar"
                  >
                    <MdCheckCircle className="inline-block text-gray-600 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    aria-label="Confirmar eliminación"
                  >
                    <MdCheckCircle className="inline-block text-white mr-2" />
                    Eliminar
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
