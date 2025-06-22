import { ApiError, apiService } from "@/services/api";
import { BeachesQueryParams, Event, EventsQueryParams } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface PaginatedApiState<T> extends ApiState<T> {
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

// Generic hook for API calls
function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof ApiError ? error.message : "An error occurred",
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Events hooks
export function useEvents(params?: EventsQueryParams) {
  const [state, setState] = useState<PaginatedApiState<Event[]>>({
    data: null,
    loading: true,
    error: null,
    hasNextPage: false,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchEvents = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!append) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const response = await apiService.getEvents({ ...params, page });
        setState((prev) => ({
          data:
            append && prev.data
              ? [...prev.data, ...response.events]
              : response.events,
          loading: false,
          error: null,
          hasNextPage: response.current_page < response.total_pages,
          currentPage: response.current_page,
          totalPages: response.total_pages,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof ApiError
              ? error.message
              : "Failed to fetch events",
        }));
      }
    },
    [params]
  );

  const loadMore = useCallback(() => {
    if (state.hasNextPage && !state.loading) {
      fetchEvents(state.currentPage + 1, true);
    }
  }, [state.hasNextPage, state.loading, state.currentPage, fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    ...state,
    refetch: () => fetchEvents(),
    loadMore,
  };
}

export function useEvent(id: number) {
  return useApiCall(() => apiService.getEventById(id), [id]);
}

// Categories hooks
export function useCategories() {
  return useApiCall(() => apiService.getCategories());
}

export function useCategory(id: number) {
  return useApiCall(() => apiService.getCategoryById(id), [id]);
}

// Municipalities hooks
export function useMunicipalities() {
  return useApiCall(() => apiService.getMunicipalities());
}

export function useMunicipality(id: number) {
  return useApiCall(() => apiService.getMunicipalityById(id), [id]);
}

// Beaches hooks
export function useBeaches(params?: BeachesQueryParams) {
  return useApiCall(() => apiService.getBeaches(params), [params]);
}

export function useBeach(id: number) {
  return useApiCall(() => apiService.getBeachById(id), [id]);
}

// Specialized hooks
export function useEventsByCategory(categoryId: number, page: number = 1) {
  return useEvents({ category_id: categoryId, page });
}

export function useEventsByMunicipality(
  municipalityId: number,
  page: number = 1
) {
  return useEvents({ municipality_id: municipalityId, page });
}

export function usePublicBeaches() {
  return useBeaches({ is_public: true });
}

export function useBeachesByMunicipality(municipalityId: number) {
  return useBeaches({ municipality_id: municipalityId });
}
