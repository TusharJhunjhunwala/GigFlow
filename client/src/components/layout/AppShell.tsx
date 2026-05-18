import { BarChart3, LogOut, Moon, Sun, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { initials } from "../../lib/format";

export const AppShell = ({ children }: { children: ReactNode }): JSX.Element => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-900 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold">GigFlow</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Smart Leads</p>
            </div>
          </div>

          <nav className="mt-8">
            <div className="flex items-center gap-3 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white">
              <Users className="h-4 w-4" aria-hidden="true" />
              Leads Dashboard
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Lead Operations
                </p>
                <h1 className="text-xl font-bold sm:text-2xl">Smart Leads Dashboard</h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="Toggle dark mode"
                  title="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                {user ? (
                  <div className="hidden items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 sm:flex">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-100 text-sm font-bold text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-200">
                      {initials(user.name)}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{user.role}</Badge>
                    </div>
                  </div>
                ) : null}

                <Button variant="ghost" className="h-10 px-3" onClick={logout} title="Log out">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};
