import type { LeadSource, LeadStatus } from "../types/lead";

export const leadStatuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
export const leadSources: LeadSource[] = ["Website", "Instagram", "Referral"];

export const statusTone: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
  Contacted: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
  Qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
};
