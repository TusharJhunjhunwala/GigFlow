import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps): JSX.Element => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <SearchX className="mb-4 h-10 w-10 text-slate-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
};
