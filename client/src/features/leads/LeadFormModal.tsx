import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Select } from "../../components/ui/Select";
import { leadSources, leadStatuses } from "../../lib/constants";
import type { Lead, LeadInput, LeadSource, LeadStatus } from "../../types/lead";

interface LeadFormModalProps {
  open: boolean;
  lead: Lead | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: LeadInput) => Promise<void>;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const defaultInput: LeadInput = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

const validateLead = (input: LeadInput): FormErrors => {
  const errors: FormErrors = {};

  if (input.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!input.email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  return errors;
};

export const LeadFormModal = ({ open, lead, saving, onClose, onSubmit }: LeadFormModalProps): JSX.Element | null => {
  const [form, setForm] = useState<LeadInput>(defaultInput);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(
      lead
        ? {
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source
          }
        : defaultInput
    );
    setErrors({});
  }, [lead, open]);

  if (!open) {
    return null;
  }

  const updateField = <K extends keyof LeadInput>(key: K, value: LeadInput[K]): void => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateLead(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lead ? "Update lead" : "Create lead"}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{lead ? lead.name : "New lead"}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close form"
            title="Close form"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <Field
            label="Name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            error={errors.name}
            autoFocus
          />

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Status" value={form.status} onChange={(event) => updateField("status", event.target.value as LeadStatus)}>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>

            <Select label="Source" value={form.source} onChange={(event) => updateField("source", event.target.value as LeadSource)}>
              {leadSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {lead ? "Save changes" : "Create lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
