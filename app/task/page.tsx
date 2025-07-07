'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskList from '../components/Task/TaskList';

const TaskPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TaskList />
    </DndProvider>
  );
};

export default TaskPage;
