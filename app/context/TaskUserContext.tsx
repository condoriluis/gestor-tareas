'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type TaskUserContextType = {
  userId: number | null;
  userName: string;
  setUserId: (id: number | null) => void;
  setUserName: (name: string) => void;
  refreshHistory: () => void;
};

const TaskUserContext = createContext<TaskUserContextType | undefined>(undefined);

export const TaskUserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshHistory = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <TaskUserContext.Provider value={{ userId, userName, setUserId, setUserName, refreshHistory }}>
      {children}
    </TaskUserContext.Provider>
  );
};

export const useTaskUser = () => {
  const context = useContext(TaskUserContext);
  if (!context) throw new Error('useTaskUser debe usarse dentro de TaskUserProvider');
  return context;
};
