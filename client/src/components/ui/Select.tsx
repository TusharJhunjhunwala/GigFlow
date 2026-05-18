import { type SelectHTMLAttributes } from "react";
import { classNames } from "../../lib/classNames";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = ({ label, error, className, children, ...props }: SelectProps): JSX.Element => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className={classNames(
          "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-700",
          error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-700" : "",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-2 block text-sm text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  );
};
