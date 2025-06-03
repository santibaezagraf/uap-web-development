import { usePaginationStore } from '../store/todoStore';

export function Pagination({ totalItems }: { totalItems: number }) {
  const { currentPage, itemsPerPage, setCurrentPage } = usePaginationStore();
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only one page, don't render the pagination
  if (totalPages <= 1) return null;
  
  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center gap-2 my-4">
      {/* Previous page button */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        &lt;
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {number}
        </button>
      ))}
      
      {/* Next page button */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        &gt;
      </button>
    </div>
  );
}
