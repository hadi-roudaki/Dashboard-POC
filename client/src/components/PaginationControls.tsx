import { currentPage, totalPages } from "../signals/orderSignals";

export default function PaginationControls() {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={currentPage.value === 1}
        onClick={() => currentPage.value--}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage.value} of {totalPages.value}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={currentPage.value >= totalPages.value}
        onClick={() => currentPage.value++}
      >
        Next
      </button>
    </div>
  );
}
