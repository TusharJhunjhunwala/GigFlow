import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import type { PaginationMeta } from "../../types/lead";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps): JSX.Element => {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing {start}-{end} of {pagination.total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
          Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
