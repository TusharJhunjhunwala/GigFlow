import { apiFileRequest, apiRequest } from "./http";
import type { Lead, LeadFilters, LeadInput, LeadListResponse } from "../types/lead";

const toParams = (filters: Partial<LeadFilters>, includePage: boolean): URLSearchParams => {
  const params = new URLSearchParams();

  if (includePage && filters.page) {
    params.set("page", String(filters.page));
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params;
};

export const getLeads = (filters: LeadFilters): Promise<LeadListResponse> => {
  const params = toParams(filters, true);
  return apiRequest<LeadListResponse>(`/leads?${params.toString()}`);
};

export const createLead = async (input: LeadInput): Promise<Lead> => {
  const response = await apiRequest<{ lead: Lead }>("/leads", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return response.lead;
};

export const getLead = async (id: string): Promise<Lead> => {
  const response = await apiRequest<{ lead: Lead }>(`/leads/${id}`);
  return response.lead;
};

export const updateLead = async (id: string, input: LeadInput): Promise<Lead> => {
  const response = await apiRequest<{ lead: Lead }>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return response.lead;
};

export const deleteLead = (id: string): Promise<{ id: string }> => {
  return apiRequest<{ id: string }>(`/leads/${id}`, {
    method: "DELETE"
  });
};

export const exportLeads = (filters: LeadFilters): Promise<Blob> => {
  const params = toParams(filters, false);
  return apiFileRequest(`/leads/export/csv?${params.toString()}`);
};
