'use client';

import { MdSearch, MdAutorenew } from 'react-icons/md';

type UserFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: number | null;
  onStatusFilterChange: (value: number | null) => void;
  roleFilter: string | null;
  onRoleFilterChange: (value: string | null) => void;
  onClearFilters: () => void;
};

export default function UserFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onClearFilters
}: UserFiltersProps) {
  const hasFilters = searchTerm || statusFilter !== null || roleFilter !== null;

  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
            value={statusFilter ?? ''}
            onChange={(e) => onStatusFilterChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todos los estados</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>

          <select
            className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E57B]"
            value={roleFilter ?? ''}
            onChange={(e) => onRoleFilterChange(e.target.value || null)}
          >
            <option value="">Todos los roles</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>

          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="p-2 bg-gray-700 text-yellow-400 rounded-lg hover:bg-gray-600 flex items-center justify-center cursor-pointer"
              title="Limpiar filtros"
            >
              <MdAutorenew size={18} className="animate-spin" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
