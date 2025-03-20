import React, { useState } from "react";
import EditTask from "./EditTask";
import { MdCheckCircle, MdCancel, MdEdit, MdDelete } from "react-icons/md";

type Task = { id: number; title: string; description: string; status: string };

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, title: string, description: string, status: string) => void;
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
    <div className="bg-white p-4 rounded shadow-lg">
      {editMode ? (
        <EditTask
          title={task.title}
          description={task.description}
          status={task.status}
          onSave={(title, description, status) => {
            onUpdate(task.id, title, description, status);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Estado:</span>
            
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                task.status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : task.status === "in_progress"
                  ? "bg-blue-200 text-blue-800"
                  : task.status === "done"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {
                task.status === "pending"
                  ? "Pendiente"
                  : task.status === "in_progress"
                  ? "En Progreso"
                  : task.status === "done"
                  ? "Completada"
                  : "Sin especificar"
              }
            </span>
          </div>
            <hr className="border border-dashed mt-2"/>
          <div className="flex space-x-4">
        
            <button
              onClick={() => setEditMode(true)}
              className="text-teal-500 hover:text-teal-600 transition duration-300 cursor-pointer"
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
