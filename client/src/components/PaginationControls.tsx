import { currentPage, totalPages } from "../signals/orderSignals";
import { useSignals } from "@preact/signals-react/runtime";

export default function PaginationControls() {
  useSignals();
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const current = currentPage.value;
    const total = totalPages.value;

    // Always show first page
    if (total > 0) pages.push(1);

    // Show pages around current page
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    if (end < total - 1) pages.push('...');

    // Always show last page
    if (total > 1) pages.push(total);

    return pages;
  };

  if (totalPages.value <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage.value === 1}
          onClick={() => goToPage(currentPage.value - 1)}
        >
          ← Previous
        </button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                page === currentPage.value
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage.value >= totalPages.value}
          onClick={() => goToPage(currentPage.value + 1)}
        >
          Next →
        </button>
      </div>

      <div className="mt-3 text-center text-sm text-gray-600">
        Page {currentPage.value} of {totalPages.value}
      </div>
    </div>
  );
}
