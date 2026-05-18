import { AlertTriangle } from "lucide-react";

interface AlertProps {
  message: string;
}

export const Alert = ({ message }: AlertProps): JSX.Element => {
  return (
    <div className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};
