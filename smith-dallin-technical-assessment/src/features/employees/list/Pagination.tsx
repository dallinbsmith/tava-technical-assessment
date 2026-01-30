import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "../__types__";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-muted">
        <span className="font-medium text-primary">{currentPage}</span> /{" "}
        {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5  hover:bg-elevated text-muted hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-border mx-1" />
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5  hover:bg-elevated text-muted hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
