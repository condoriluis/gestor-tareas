import React, { useState } from "react";
import EditTask from "./EditTask";

type Task = { id: number; title: string; description: string; status: string };

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, title: string, description: string, status: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);

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
          <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
          <p>{task.description}</p>
          <div className="text-sm mb-2 text-gray-500">Estado: {task.status}</div>
          <button
            onClick={() => setEditMode(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
