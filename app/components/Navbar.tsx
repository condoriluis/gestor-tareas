'use client';

import React, { useState, useEffect } from 'react';
import { MdFilterList, MdOutlineShowChart, MdSearch, MdClose, MdOutlinePeople, MdInfoOutline } from 'react-icons/md';
import ProfileUser from './Auth/ProfileUser';
import LogoutButton from './Auth/LogoutButton';
import { Task } from '@/utils/types';
import { useRouter } from 'next/navigation';
import UserListModal from './User/UserListModal';
import { AboutModal } from './AboutModal';

type UserType = {
  name_user?: string;
  email_user?: string;
  rol_user?: string;
  date_created_user?: string;
};

type NavbarProps = {
  user: UserType | null;
  tasks: Task[];
  onSearch: (term: string) => void;
  onOpenFilterModal: () => void;
  onOpenReportModal: () => void;
  onOpenAddTaskModal: () => void;
};

export default function Navbar({
  user,
  tasks,
  onSearch,
  onOpenFilterModal,
  onOpenReportModal,
  onOpenAddTaskModal,
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!user);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!user) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
      } finally {
        if (user) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const titles = tasks.map(t => t.title_task);
      const uniqueTitles = [...new Set(titles)];
      const filtered = uniqueTitles.filter(title => 
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, tasks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <nav className="bg-[#1E1E1E] border-b border-gray-700 px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="h-7 w-36 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-md animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-56 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-9 w-56 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <nav className="bg-[#1E1E1E] border-b border-gray-700 px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-3 sm:gap-0">
          <div className="flex items-center">
            <a href="/task" className="flex items-center gap-2">
              <h1 className="text-white text-lg sm:text-xl font-bold">Gestor de tareas</h1>
            </a>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-between">
            <div className="relative w-full sm:flex-1 sm:max-w-md mx-2 sm:mx-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-10 pr-8 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B] focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {mounted && searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSuggestions([]);
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  <MdClose size={18} />
                </button>
              )}
              {mounted && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#2A2A2A] rounded-lg shadow-lg border border-gray-700">
                  {suggestions.map((suggestion, i) => (
                    <div 
                      key={i}
                      className="px-4 py-2 hover:bg-[#343434] cursor-pointer text-white text-sm"
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={onOpenFilterModal}
                className="text-gray-300 hover:text-white text-sm sm:text-base transition cursor-pointer flex items-center gap-1"
              >
                <MdFilterList size={20} />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              
              <button 
                onClick={onOpenReportModal}
                className="text-gray-300 hover:text-white text-sm sm:text-base transition cursor-pointer flex items-center gap-1"
              >
                <MdOutlineShowChart size={20} />
                <span className="hidden sm:inline">Reportes</span>
              </button>

              {user?.rol_user === 'admin' && <UserListModal />}

              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="text-gray-300 hover:text-white text-sm sm:text-base transition cursor-pointer flex items-center gap-1"
              >
                <MdInfoOutline size={20} />
                <span className="hidden sm:inline">Acerca de</span>
              </button>

              <div className="relative group">
                <button
                  onClick={onOpenAddTaskModal}
                  className="bg-[#00E57B] hover:bg-teal-600 text-white transition text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:shadow-md active:scale-95"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Nueva tarea</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 transition text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sm:hidden">
                  Nueva tarea
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="relative group">
                    <span className="text-white text-sm font-medium">{user?.name_user}</span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-[#00E57B] cursor-pointer"
                    onClick={() => setIsProfileModalOpen(true)}
                  >
                    {user?.name_user ? (
                      <span className="text-white text-sm font-medium">
                        {user.name_user.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-white text-sm font-medium">U</span>
                    )}
                  </div>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        <ProfileUser 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          user={user} 
        />
      </nav>
    </>
  );
}