'use client';

import { useDrop } from 'react-dnd';
import { useEffect, useState } from 'react';
import { showToast } from "@/utils/toastMessages";
import TaskCard from './TaskCard';
import AddTask from './AddTask';

type Task = { id: number; title: string; description: string; priority: string; status: string; };

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTask, setIsAddTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Error al obtener tareas');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError('No se pudieron cargar las tareas');
      showToast('Error al cargar la tarea', 'error');
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
      if (!response.ok || !data.id) throw new Error('Error en la creación');

      setTasks((prevTasks) => [data, ...prevTasks]);
      setIsAddTask(false);
      showToast('Tarea agregada exitosamente', 'success');

    } catch (error) {
      showToast('No se pudo agregar la tarea', 'error');
    }
  };

  const handleUpdateTask = async (id: number, title: string, description: string, priority: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });
  
      if (!response.ok) throw new Error('Error al editar tarea');
  
      const updatedTask = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      showToast('Tarea editado exitosamente', 'success');

    } catch (error) {
      showToast('No se pudo editar la tarea', 'error');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error('Error al editar tarea');
  
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      showToast('Tarea eliminado exitosamente', 'success')

    } catch (error) {
      showToast('No se pudo eliminar la tarea', 'error');
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
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className="min-h-screen p-8 bg-[#1E1E1E]">

      {loading ? (
        <p className="text-center text-gray-500">Cargando tareas...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
        <h1 className="text-white text-center mb-6 text-xs">Mis Tareas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  
          {isAddTask ? (
            <AddTask onAddTask={handleAddTask} onCancel={() => setIsAddTask(false)} />
          ) : (
            <div className="bg-[#343434] border-2 border-dashed border-[#00E57B] p-4 rounded shadow-lg text-center text-white cursor-pointer" onClick={() => setIsAddTask(true)}>
              <h3 className="text-lg font-bold">+ Nueva Tarea</h3>
              <p>Haz clic para agregar</p>
            </div>
          )}

          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={() => {handleDeleteTask(task.id)}} />
            ))
          ) : (
            <p className="text-center text-gray-500">No hay tareas disponibles</p>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default TaskBoard;