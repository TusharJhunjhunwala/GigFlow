import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { statusTone } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import type { Lead } from "../../types/lead";

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onView, onEdit, onDelete }: LeadTableProps): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              {["Lead", "Status", "Source", "Owner", "Created", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/70">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-950 dark:text-white">{lead.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge className={statusTone[lead.status]}>{lead.status}</Badge>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{lead.source}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{lead.owner.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lead.owner.role}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" className="h-9 w-9 px-0" onClick={() => onView(lead)} title="View lead">
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" className="h-9 w-9 px-0" onClick={() => onEdit(lead)} title="Edit lead">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" className="h-9 w-9 px-0 text-rose-600 dark:text-rose-300" onClick={() => onDelete(lead)} title="Delete lead">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid divide-y divide-slate-100 dark:divide-slate-800 lg:hidden">
        {leads.map((lead) => (
          <article key={lead.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{lead.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
              </div>
              <Badge className={statusTone[lead.status]}>{lead.status}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Source</span>
                <p className="font-semibold">{lead.source}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Owner</span>
                <p className="font-semibold">{lead.owner.name}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button type="button" variant="secondary" className="h-9 flex-1 px-3" onClick={() => onView(lead)}>
                <Eye className="h-4 w-4" aria-hidden="true" />
                View
              </Button>
              <Button type="button" variant="secondary" className="h-9 flex-1 px-3" onClick={() => onEdit(lead)}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit
              </Button>
              <Button type="button" variant="danger" className="h-9 flex-1 px-3" onClick={() => onDelete(lead)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
