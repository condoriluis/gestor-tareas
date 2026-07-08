'use client';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import TaskList from '../components/Task/TaskList';

const TaskPage = () => {
  const [backend, setBackend] = useState<typeof HTML5Backend | undefined>();

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setBackend(() => isTouch ? TouchBackend : HTML5Backend);
  }, []);

  if (!backend) return null;

  return (
    <DndProvider backend={backend}>
      <TaskList />
    </DndProvider>
  );
};

export default TaskPage;
