import { useCallback, useEffect, useState } from "react";
import { getLeads } from "../api/leadsApi";
import type { LeadFilters, LeadListResponse } from "../types/lead";

interface UseLeadsResult {
  data: LeadListResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Unable to load leads";
};

export const useLeads = (filters: LeadFilters): UseLeadsResult => {
  const [data, setData] = useState<LeadListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLeads(filters);
      setData(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
