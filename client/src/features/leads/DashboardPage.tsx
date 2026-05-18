import { useMemo, useState } from "react";
import { Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { createLead, deleteLead, exportLeads, getLead, updateLead } from "../../api/leadsApi";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { AppShell } from "../../components/layout/AppShell";
import { useAuth } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useLeads } from "../../hooks/useLeads";
import { leadStatuses, statusTone } from "../../lib/constants";
import type { Lead, LeadFilters as LeadFilterState, LeadInput } from "../../types/lead";
import { LeadDetailsPanel } from "./LeadDetailsPanel";
import { LeadFilters } from "./LeadFilters";
import { LeadFormModal } from "./LeadFormModal";
import { LeadTable } from "./LeadTable";
import { Pagination } from "./Pagination";

const initialFilters: LeadFilterState = {
  status: "",
  source: "",
  search: "",
  sort: "latest",
  page: 1
};

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Action failed";
};

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeadFilterState>(initialFilters);
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryFilters = useMemo<LeadFilterState>(
    () => ({
      status: filters.status,
      source: filters.source,
      sort: filters.sort,
      page: filters.page,
      search: debouncedSearch
    }),
    [debouncedSearch, filters.page, filters.sort, filters.source, filters.status]
  );

  const { data, loading, error, refetch } = useLeads(queryFilters);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const leads = data?.items ?? [];
  const pagination = data?.pagination;
  const statusCounts = leadStatuses.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length
  }));

  const updateFilters = (patch: Partial<LeadFilterState>): void => {
    setFilters((current) => ({
      ...current,
      ...patch
    }));
  };

  const openCreateForm = (): void => {
    setEditingLead(null);
    setActionError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (lead: Lead): void => {
    setEditingLead(lead);
    setActionError(null);
    setIsFormOpen(true);
  };

  const handleSaveLead = async (input: LeadInput): Promise<void> => {
    setSaving(true);
    setActionError(null);

    try {
      const savedLead = editingLead ? await updateLead(editingLead.id, input) : await createLead(input);
      setSelectedLead(savedLead);
      setIsFormOpen(false);
      await refetch();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleViewLead = async (lead: Lead): Promise<void> => {
    setActionError(null);

    try {
      const freshLead = await getLead(lead.id);
      setSelectedLead(freshLead);
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    }
  };

  const handleDeleteLead = async (lead: Lead): Promise<void> => {
    const confirmed = window.confirm(`Delete ${lead.name}?`);
    if (!confirmed) {
      return;
    }

    setActionError(null);

    try {
      await deleteLead(lead.id);
      if (selectedLead?.id === lead.id) {
        setSelectedLead(null);
      }
      await refetch();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    }
  };

  const handleExport = async (): Promise<void> => {
    setExporting(true);
    setActionError(null);

    try {
      const blob = await exportLeads(queryFilters);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "gigflow-leads.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total leads</p>
                <p className="mt-2 text-3xl font-bold">{pagination?.total ?? 0}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-200">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Access mode</p>
                <p className="mt-2 text-lg font-bold">{user?.role === "admin" ? "All leads" : "Owned leads"}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {statusCounts.slice(0, 2).map(({ status, count }) => (
            <div key={status} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Visible {status.toLowerCase()}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-3xl font-bold">{count}</p>
                <Badge className={statusTone[status]}>{status}</Badge>
              </div>
            </div>
          ))}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {user?.role === "admin" ? "Admin can manage every lead in the pipeline." : "Sales users see the leads assigned to them."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => void refetch()}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Lead
            </Button>
          </div>
        </div>

        <LeadFilters filters={filters} onChange={updateFilters} onExport={() => void handleExport()} exporting={exporting} />

        {actionError ? <Alert message={actionError} /> : null}
        {error ? <Alert message={error} /> : null}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section>
            {loading ? <Spinner label="Loading leads" /> : null}
            {!loading && leads.length === 0 ? (
              <EmptyState title="No leads found" description="Adjust the filters or create a new lead to populate this dashboard." />
            ) : null}
            {!loading && leads.length > 0 ? (
              <>
                <LeadTable
                  leads={leads}
                  onView={(lead) => void handleViewLead(lead)}
                  onEdit={openEditForm}
                  onDelete={(lead) => void handleDeleteLead(lead)}
                />
                {pagination ? <Pagination pagination={pagination} onPageChange={(page) => updateFilters({ page })} /> : null}
              </>
            ) : null}
          </section>

          <LeadDetailsPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </div>
      </div>

      <LeadFormModal
        open={isFormOpen}
        lead={editingLead}
        saving={saving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveLead}
      />
    </AppShell>
  );
};
