import { Loader2 } from "lucide-react";

export const Spinner = ({ label = "Loading" }: { label?: string }): JSX.Element => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300">
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
