export const validateTaskData = (taskData: { title: string; description: string; priority: string; status: string }) => {
  if (!taskData.title || !taskData.description || !taskData.status) {
    throw new Error('Faltan datos para la tarea');
  }
  // Puedes agregar más validaciones aquí si es necesario
};
