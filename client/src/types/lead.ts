import type { AuthUser } from "./auth";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type LeadSort = "latest" | "oldest";

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: AuthUser;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadFilters {
  status: LeadStatus | "";
  source: LeadSource | "";
  search: string;
  sort: LeadSort;
  page: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LeadListResponse {
  items: Lead[];
  pagination: PaginationMeta;
}
