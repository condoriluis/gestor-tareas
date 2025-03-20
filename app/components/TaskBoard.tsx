'use client';

import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useEffect, useState } from 'react';
import AddTask from './AddTask';

type Task = { id: number; title: string; description: string; status: string };

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTask, setIsAddTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`Error al obtener tareas: ${response.statusText}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError('No se pudieron cargar las tareas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task: Task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      const data = await response.json();
      if (!response.ok || !data.id) {
        throw new Error('El servidor no devolvió una tarea válida.');
      }

      setTasks((prevTasks) => [data, ...prevTasks]);
      setIsAddTask(false);
    } catch (error) {
      console.error('Error en handleAddTask:', error);
    }
  };

  const handleUpdateTask = async (id: number, title: string, description: string, status: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo actualizar la tarea.");
      }
  
      const updatedTask = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error en handleUpdateTask:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("No se pudo eliminar la tarea.");
      }
  
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };
  
  const [, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: number }) => {
      const updatedTasks = tasks.map((task) =>
        task.id === item.id ? { ...task, status: 'in_progress' } : task
      );
      setTasks(updatedTasks);
    },
  }));

  return (
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className="min-h-screen p-8 bg-gray-100">
      {loading ? (
        <p className="text-center text-gray-500">Cargando tareas...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Agregar tarea */}
          {isAddTask ? (
            <AddTask onAddTask={handleAddTask} onCancel={() => setIsAddTask(false)} />
          ) : (
            <div className="bg-white border-2 border-dashed border-teal-300 p-4 rounded shadow-lg text-center text-gray-500 cursor-pointer" onClick={() => setIsAddTask(true)}>
              <h3 className="text-lg font-bold">+ Nueva Tarea</h3>
              <p>Haz clic para agregar</p>
            </div>
          )}

          {/* Mostrar tareas */}
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={() => {handleDeleteTask(task.id)}} />
            ))
          ) : (
            <p className="text-center text-gray-500">No hay tareas disponibles</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
