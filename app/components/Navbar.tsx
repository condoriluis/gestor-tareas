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
  name?: string;
  email?: string;
  rol?: string;
  createdAt?: string;
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
      const titles = tasks.map(t => t.title);
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
      <nav className="bg-[#1E1E1E] border-b border-gray-700 px-4 sm:px-6 py-1.5 sm:py-2">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="h-5 w-28 bg-gray-700 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-40 bg-gray-700 rounded animate-pulse" />
            <div className="h-7 w-7 rounded-full bg-gray-700 animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <nav className="bg-[#1E1E1E] border-b border-gray-700 px-2 sm:px-6 py-1.5 sm:py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-1 sm:gap-2">
          <a href="/task" className="flex items-center gap-1 shrink-0">
            <h1 className="text-white text-xs sm:text-base font-bold tracking-tight truncate max-w-[90px] sm:max-w-none">Gestor de tareas</h1>
          </a>

          <div className="flex items-center gap-0.5 sm:gap-2 flex-1 justify-end min-w-0">
            <div className="relative flex-1 max-w-[90px] sm:max-w-[200px] lg:max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2 pointer-events-none">
                <MdSearch className="text-gray-500" size={12} />
              </div>
              <input
                type="text"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-6 sm:pl-7 pr-5 sm:pr-6 py-1 sm:py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#00E57B] focus:border-transparent transition-all text-xs"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {mounted && searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSuggestions([]);
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-1 text-gray-500 hover:text-white transition-colors"
                >
                  <MdClose size={12} />
                </button>
              )}
              {mounted && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#2A2A2A] rounded-lg shadow-lg border border-gray-700">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 hover:bg-[#343434] cursor-pointer text-white text-xs"
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

            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <button
                onClick={onOpenFilterModal}
                className="text-gray-400 hover:text-white transition cursor-pointer p-1 rounded-md hover:bg-[#2A2A2A]"
                title="Filtros"
              >
                <MdFilterList size={16} />
              </button>

              <button
                onClick={onOpenReportModal}
                className="text-gray-400 hover:text-white transition cursor-pointer p-1 rounded-md hover:bg-[#2A2A2A] hidden sm:inline-flex"
                title="Reportes"
              >
                <MdOutlineShowChart size={16} />
              </button>

              {user?.rol === 'admin' && <UserListModal />}

              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="text-gray-400 hover:text-white transition cursor-pointer p-1 rounded-md hover:bg-[#2A2A2A] hidden sm:inline-flex"
                title="Acerca de"
              >
                <MdInfoOutline size={16} />
              </button>

              <div className="relative group">
                <button
                  onClick={onOpenAddTaskModal}
                  className="bg-[#00E57B] hover:bg-teal-600 text-white text-xs px-1.5 sm:px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-0.5 shadow-sm hover:shadow-md active:scale-95"
                >
                  <span className="text-sm leading-none">+</span>
                  <span className="hidden sm:inline">Nueva tarea</span>
                </button>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none sm:hidden">
                  Nueva tarea
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border border-[#00E57B] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsProfileModalOpen(true)}
                  title={user?.name}
                >
                  {user?.name ? (
                    <span className="text-white text-[10px] sm:text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-white text-[10px] sm:text-xs font-medium">U</span>
                  )}
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
