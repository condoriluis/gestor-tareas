'use client';

import { MdOutlineAssignment, MdArrowUpward, MdArrowDownward, MdEdit, MdDelete } from 'react-icons/md';
import { User, SortConfig } from './UserListModal';
import { formatDate } from '@/utils/dateService';

type UserTableProps = {
  currentItems: User[];
  sortConfig: SortConfig;
  requestSort: (key: keyof User) => void;
  handleStatusChange: (idUser: number, newStatus: number) => void;
  openEditModal: (user: User) => void;
  openDeleteModal: (user: User) => void;
  navigateToTasks: (userId: number, userName: string) => void;
};

export default function UserTable({
  currentItems,
  sortConfig,
  requestSort,
  handleStatusChange,
  openEditModal,
  openDeleteModal,
  navigateToTasks
}: UserTableProps) {
  return (
    <div className="w-full overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-none">
      <table className="w-full hidden md:table">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            <th 
              className="p-3 text-left text-gray-300 font-medium cursor-pointer"
              onClick={() => requestSort('name_user')}
            >
              <div className="flex items-center gap-1">
                Nombre
                {sortConfig.key === 'name_user' && (
                  sortConfig.direction === 'ascending' ? 
                    <MdArrowUpward size={16} /> : 
                    <MdArrowDownward size={16} />
                )}
              </div>
            </th>
            <th className="p-3 text-left text-gray-300 font-medium">Correo</th>
            <th 
              className="p-3 text-left text-gray-300 font-medium cursor-pointer"
              onClick={() => requestSort('rol_user')}
            >
              <div className="flex items-center gap-1">
                Rol
                {sortConfig.key === 'rol_user' && (
                  sortConfig.direction === 'ascending' ? 
                    <MdArrowUpward size={16} /> : 
                    <MdArrowDownward size={16} />
                )}
              </div>
            </th>
            <th 
              className="p-3 text-left text-gray-300 font-medium hidden sm:table-cell cursor-pointer"
              onClick={() => requestSort('status_user')}
            >
              <div className="flex items-center gap-1">
                Estado
                {sortConfig.key === 'status_user' && (
                  sortConfig.direction === 'ascending' ? 
                    <MdArrowUpward size={16} /> : 
                    <MdArrowDownward size={16} />
                )}
              </div>
            </th>
            <th 
              className="p-3 text-left text-gray-300 font-medium hidden lg:table-cell cursor-pointer"
              onClick={() => requestSort('date_created_user')}
            >
              <div className="flex items-center gap-1">
                Registro
                {sortConfig.key === 'date_created_user' && (
                  sortConfig.direction === 'ascending' ? 
                    <MdArrowUpward size={16} /> : 
                    <MdArrowDownward size={16} />
                )}
              </div>
            </th>
            <th className="p-3 text-left text-gray-300 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {currentItems.map(user => (
            <tr key={user.id_user} className="hover:bg-gray-800/50">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00E57B] flex items-center justify-center text-white font-bold">
                    {user.name_user.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name_user}</span>
                </div>
              </td>
              <td className="p-3">{user.email_user}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{user.rol_user}</span>
                </div>
              </td>
              <td className="p-3 hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.status_user === 1}
                      onChange={() => handleStatusChange(user.id_user, user.status_user === 1 ? 0 : 1)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E57B]"></div>
                  </label>
                  <span className={user.status_user === 1 ? "text-green-500" : "text-red-500"}>
                    {user.status_user === 1 ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </td>
              <td className="p-3 hidden lg:table-cell">{formatDate(user.date_created_user)}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateToTasks(user.id_user, user.name_user)}
                    className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <MdOutlineAssignment size={16} />
                    <span>Ver tareas</span>
                  </button>
                  <button 
                    onClick={() => openEditModal(user)}
                    className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <MdEdit size={16} />
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => openDeleteModal(user)}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <MdDelete size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
