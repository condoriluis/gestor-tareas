'use client';

import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { showToast } from "@/utils/toastMessages";
import { Task } from '@/utils/types'
import TaskCard from './TaskCard';
import AddTask from './AddTask';

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ type: 'edit', title, description, priority }),
      });
  
      if (!response.ok) throw new Error('Error al editar tarea');
  
      const updatedTask = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      showToast('Tarea editada exitosamente', 'success');

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
  
      if (!response.ok) throw new Error('Error al eliminar tarea');
  
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      showToast('Tarea eliminada exitosamente', 'success');

    } catch (error) {
      showToast('No se pudo eliminar la tarea', 'error');
    }
  };

  const moveTask = async (taskId: number, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const response = await  fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'status', status: newStatus }),
      });
  
      if (!response.ok) throw new Error('Error al actualizar el estado');
  
      const updatedStatus = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedStatus : task))
      );
      showToast('Estado actualizado exitosamente', 'success');

    } catch (error) {
      showToast('No se pudo actualizar el estado', 'error');
    }

  };

  const statuses = [
    { key: "todo", label: "To-Do", color: "border-gray-500" },
    { key: "pending", label: "Pendientes", color: "border-yellow-500" },
    { key: "in_progress", label: "En Progreso", color: "border-blue-500" },
    { key: "done", label: "Completado", color: "border-green-500" },
  ];

  return (
    <>
    <div className="min-h-screen p-8 bg-[#1E1E1E]">
      <h1 className="text-white text-center mb-3 text-xl font-bold">Mis Tareas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map(({ key, label, color }) => {
          const [, drop] = useDrop(() => ({
            accept: "TASK",
            drop: (item: Task) => moveTask(item.id, key),
          }));

          const ref = useRef<HTMLDivElement | null>(null);
          drop(ref);

          return (
            <div
              key={key}
              ref={ref}
              className={`bg-[#2A2A2A] p-4 rounded-lg border-2 ${color} shadow-lg`}
            >
              <h2 className="text-lg font-semibold text-white text-center mb-4">{label}</h2>
              <div className="space-y-3">
                {key === 'todo' && isAddTask ? (
                  <AddTask onAddTask={handleAddTask} onCancel={() => setIsAddTask(false)} />
                ) : key === 'todo' && !isAddTask ? (
                  <div className="bg-[#343434] border-2 border-dashed border-[#00E57B] p-4 rounded shadow-lg text-center text-white cursor-pointer" onClick={() => setIsAddTask(true)}>
                    <h3 className="text-lg font-bold">+ Nueva Tarea</h3>
                    <p>Haz clic para agregar</p>
                  </div>
                ) : null}
                
                {tasks.filter(task => task.status === key).map(task => (
                  <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={() => handleDeleteTask(task.id)} />
                ))}

                {tasks.filter(task => task.status === key).length === 0 && (
                  <p className="text-center text-gray-400">Sin tareas</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default TaskBoard;
