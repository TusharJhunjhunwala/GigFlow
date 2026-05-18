import { X } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { statusTone } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import type { Lead } from "../../types/lead";

interface LeadDetailsPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailsPanel = ({ lead, onClose }: LeadDetailsPanelProps): JSX.Element | null => {
  if (!lead) {
    return null;
  }

  return (
    <aside className="rounded-md border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lead Details</p>
          <h2 className="mt-1 text-xl font-bold">{lead.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Close details"
          title="Close details"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 text-sm">
        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Status</span>
          <Badge className={statusTone[lead.status]}>{lead.status}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Source</span>
          <span className="font-semibold">{lead.source}</span>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Owner</span>
          <p className="mt-1 font-semibold">{lead.owner.name}</p>
          <p className="text-slate-500 dark:text-slate-400">{lead.owner.email}</p>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-3 dark:bg-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Created</span>
          <p className="mt-1 font-semibold">{formatDate(lead.createdAt)}</p>
        </div>
      </div>

      <Button type="button" variant="secondary" className="mt-5 w-full" onClick={onClose}>
        Done
      </Button>
    </aside>
  );
};
