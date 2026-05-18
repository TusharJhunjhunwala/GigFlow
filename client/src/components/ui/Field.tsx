import { type InputHTMLAttributes, type ReactNode } from "react";
import { classNames } from "../../lib/classNames";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const Field = ({ label, error, icon, className, ...props }: FieldProps): JSX.Element => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <span className="relative block">
        {icon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span> : null}
        <input
          className={classNames(
            "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-700",
            icon ? "pl-10" : "",
            error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-700" : "",
            className
          )}
          {...props}
        />
      </span>
      {error ? <span className="mt-2 block text-sm text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  );
};
