import { BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

export const AuthShell = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <section className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">GigFlow</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Smart Leads Dashboard</p>
              </div>
            </div>
            <h1 className="mt-12 max-w-2xl text-5xl font-bold leading-tight">
              Manage every lead from first signal to qualified opportunity.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Track source, status, owner, and timing from a focused operations dashboard.
            </p>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold">GigFlow</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Smart Leads Dashboard</p>
              </div>
            </div>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};
