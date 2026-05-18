import { Download, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Select } from "../../components/ui/Select";
import { leadSources, leadStatuses } from "../../lib/constants";
import type { LeadFilters as LeadFilterState, LeadSort } from "../../types/lead";

interface LeadFiltersProps {
  filters: LeadFilterState;
  onChange: (filters: Partial<LeadFilterState>) => void;
  onExport: () => void;
  exporting: boolean;
}

export const LeadFilters = ({ filters, onChange, onExport, exporting }: LeadFiltersProps): JSX.Element => {
  return (
    <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] lg:items-end">
      <Field
        label="Search leads"
        placeholder="Name or email"
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        icon={<Search className="h-4 w-4" aria-hidden="true" />}
      />

      <Select label="Status" value={filters.status} onChange={(event) => onChange({ status: event.target.value as LeadFilterState["status"], page: 1 })}>
        <option value="">All statuses</option>
        {leadStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>

      <Select label="Source" value={filters.source} onChange={(event) => onChange({ source: event.target.value as LeadFilterState["source"], page: 1 })}>
        <option value="">All sources</option>
        {leadSources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </Select>

      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value as LeadSort, page: 1 })}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </Select>

      <Button type="button" variant="secondary" onClick={onExport} loading={exporting} className="w-full lg:w-auto">
        <Download className="h-4 w-4" aria-hidden="true" />
        CSV
      </Button>
    </section>
  );
};
