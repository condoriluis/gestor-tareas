'use client';

import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem
}: PaginationControlsProps) {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-700">
      <div className="text-gray-400 text-sm mb-2 sm:mb-0">
        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} usuarios
      </div>
      
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-50 hover:bg-gray-700 disabled:hover:bg-gray-800"
        >
          <MdChevronLeft size={20} />
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 rounded-lg ${currentPage === number ? 'bg-[#00E57B] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-50 hover:bg-gray-700 disabled:hover:bg-gray-800"
        >
          <MdChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
