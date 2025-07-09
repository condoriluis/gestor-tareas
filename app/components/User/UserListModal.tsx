'use client';

import { useEffect, useState, useMemo } from 'react';
import { MdClose, MdEmail, MdCancel, MdOutlinePeople, MdOutlineAssignment, MdPersonAdd, MdEdit, MdAdd } from 'react-icons/md';
import { showToast } from '@/utils/toastMessages';
import { formatDate } from '@/utils/dateService';
import { User } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { useTaskUser } from '@/app/context/TaskUserContext';
import EditUser from './EditUser';
import UserFilters from './UserFilters';
import PaginationControls from './PaginationControls';
import UserTable from './UserTable';
import DeleteUser from './DeleteUser';
import AddUser from './AddUser';

export type SortConfig = {
  key: keyof User;
  direction: 'ascending' | 'descending';
};

export default function UserListModal() {
  const [users, setUsers] = useState<User[]>([]);
  const { setUserId, setUserName } = useTaskUser();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'date_created_user', 
    direction: 'descending' 
  });
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Error al obtener usuarios.');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast('Error al cargar usuarios.', 'error');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isOpen) {
      refreshUsers();
    }
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name_user.toLowerCase().includes(term) || 
        user.email_user.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== null) {
      filtered = filtered.filter(user => user.status_user === statusFilter);
    }
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.rol_user === roleFilter);
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [users, searchTerm, statusFilter, roleFilter, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = async (idUser: number, newStatus: number) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUser, status: newStatus })
      });
      
      if (!response.ok) throw new Error();
      
      showToast(
        `Usuario ${newStatus === 1 ? 'activado' : 'desactivado'} correctamente`, 
        'success'
      );
      refreshUsers();
    } catch (error) {
      showToast('Error al cambiar estado', 'error');
    }
  };

  const handleEditSubmit = async (userData: {idUser: number; name: string; email: string; rol: string}) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error();
      
      showToast('Usuario actualizado correctamente', 'success');
      refreshUsers();
      return true;
    } catch (error) {
      showToast('Error al actualizar usuario', 'error');
      return false;
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUser: userToDelete.id_user })
      });
      
      if (!response.ok) throw new Error();
      
      showToast('Usuario eliminado correctamente', 'success');
      setDeleteModalOpen(false);
      refreshUsers();
    } catch (error) {
      showToast('Error al eliminar usuario', 'error');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setRoleFilter(null);
    setCurrentPage(1);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-300 hover:text-white text-sm sm:text-base transition cursor-pointer flex items-center gap-1"
      >
        <MdOutlinePeople size={20} />
        <span className="hidden sm:inline">Usuarios</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">Gestión de Usuarios</h3>
                
                <button
                  onClick={() => setAddUserModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-1 py-1 bg-[#00E57B] hover:bg-[#00C56A] text-white rounded-lg transition-colors cursor-pointer"
                >
                  <MdPersonAdd size={18} />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              <button
                onClick={() => setAddUserModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-2 bg-[#00E57B] hover:bg-[#00C56A] text-white rounded-full shadow-lg transition-transform hover:scale-105"
                aria-label="Agregar usuario"
              >
                <MdAdd size={24} />
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="border-b border-gray-700">
              <UserFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                roleFilter={roleFilter}
                onRoleFilterChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}
                onClearFilters={clearFilters}
              />
            </div>

            <div className="overflow-auto max-h-[calc(90vh-180px)]">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-pulse text-white">Cargando usuarios...</div>
                </div>
              ) : (
                <>
                  <div className="block md:hidden space-y-4 p-4">
                    {currentItems.length > 0 ? (
                      currentItems.map(user => (
                        <div key={user.id_user} className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#00E57B] flex items-center justify-center text-white font-bold">
                              {user.name_user.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{user.name_user}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MdEmail size={14} />
                                <span>{user.email_user}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="capitalize">{user.rol_user}</span>
                            </div>
                            
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
                            
                            <div className="col-span-2 text-gray-400 text-sm">
                              Registro: {formatDate(user.date_created_user)}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between">
                            <button 
                              onClick={() => {
                                setUserId(user.id_user);
                                setUserName(user.name_user);
                                setIsOpen(false);
                                router.push('/task');
                              }}
                              className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 cursor-pointer hover:text-green-700"
                            >
                              <MdOutlineAssignment size={16} />
                              <span>Ver tareas</span>
                            </button>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => openEditModal(user)}
                                className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center gap-1 cursor-pointer hover:text-green-700"
                              >
                                <MdEdit size={16} />
                                <span>Editar</span>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(user)}
                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 cursor-pointer"
                              >
                                <MdCancel size={16} />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">No se encontraron usuarios</div>
                    )}
                  </div>

                  <UserTable
                    currentItems={currentItems}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    handleStatusChange={handleStatusChange}
                    openEditModal={openEditModal}
                    openDeleteModal={openDeleteModal}
                    navigateToTasks={(userId, userName) => {
                      setUserId(userId);
                      setUserName(userName);
                      setIsOpen(false);
                      router.push('/task'); 
                    }}
                  />
                </>
              )}
            </div>

            {filteredUsers.length > itemsPerPage && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            )}
            
            {filteredUsers.length <= itemsPerPage && (
              <div className="p-4 border-t border-gray-700">
                <span className="text-sm text-gray-400">{filteredUsers.length} usuarios encontrados</span>
              </div>
            )}
          </div>
        </div>
      )}

      {userToEdit && (
        <EditUser 
          user={userToEdit}
          onClose={closeEditModal}
          onSave={handleEditSubmit}
        />
      )}

      {deleteModalOpen && userToDelete && (
        <DeleteUser
          isOpen={deleteModalOpen}
          user={userToDelete}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}

      <AddUser
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={refreshUsers}
      />
    </>
  );
}
