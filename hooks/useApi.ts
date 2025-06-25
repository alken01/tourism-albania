import { ApiError, apiService } from "@/services/api";
import {
  BeachesQueryParams,
  Event,
  EventsQueryParams,
  FilteredEventsQueryParams,
} from "@/types/api";
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

// Cache configuration
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// In-memory cache storage
const apiCache = new Map<string, CacheEntry<any>>();

// Cache utility functions
function generateCacheKey(endpoint: string, params?: any): string {
  if (!params) return endpoint;
  const sortedParams = JSON.stringify(params, Object.keys(params).sort());
  return `${endpoint}:${sortedParams}`;
}

function getCachedData<T>(cacheKey: string): T | null {
  const cached = apiCache.get(cacheKey);
  if (!cached) return null;

  if (Date.now() > cached.expiry) {
    apiCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function setCachedData<T>(cacheKey: string, data: T): void {
  const now = Date.now();
  apiCache.set(cacheKey, {
    data,
    timestamp: now,
    expiry: now + CACHE_TTL,
  });
}

// Clear expired cache entries periodically
function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of apiCache.entries()) {
    if (now > entry.expiry) {
      apiCache.delete(key);
    }
  }
}

// Clear expired cache every 30 minutes
setInterval(clearExpiredCache, 30 * 60 * 1000);

// Generic hook for API calls with caching support
function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  cacheKey?: string
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async (forceRefresh: boolean = false) => {
    // Check cache first if cache key is provided and not forcing refresh
    if (cacheKey && !forceRefresh) {
      const cachedData = getCachedData<T>(cacheKey);
      if (cachedData) {
        setState({ data: cachedData, loading: false, error: null });
        return;
      }
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });

      // Cache the result if cache key is provided
      if (cacheKey) {
        setCachedData(cacheKey, data);
      }
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
    refetch: () => fetchData(true), // Force refresh when manually refetching
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
    async (
      page: number = 1,
      append: boolean = false,
      forceRefresh: boolean = false
    ) => {
      const cacheKey = generateCacheKey("events", { ...params, page });

      // Check cache first if not appending and not forcing refresh
      if (!append && !forceRefresh) {
        const cachedData = getCachedData<any>(cacheKey);
        if (cachedData && cachedData.events) {
          setState({
            data: cachedData.events,
            loading: false,
            error: null,
            hasNextPage: cachedData.current_page < cachedData.total_pages,
            currentPage: cachedData.current_page,
            totalPages: cachedData.total_pages,
          });
          return;
        }
      }

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

        // Cache the response if not appending
        if (!append) {
          setCachedData(cacheKey, response);
        }
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
    loadMore,
    refetch: () => fetchEvents(1, false, true),
  };
}

// Filtered Events hook
export function useFilteredEvents(params?: FilteredEventsQueryParams) {
  const cacheKey = params
    ? generateCacheKey("filtered-events", params)
    : "filtered-events";

  return useApiCall(
    () => apiService.getFilteredEvents(params),
    [params],
    cacheKey
  );
}

export function useEvent(id: number) {
  const cacheKey = generateCacheKey("event", { id });
  return useApiCall(() => apiService.getEventById(id), [id], cacheKey);
}

// Categories hooks
export function useCategories() {
  const cacheKey = generateCacheKey("categories");
  return useApiCall(() => apiService.getCategories(), [], cacheKey);
}

export function useCategory(id: number) {
  return useApiCall(() => apiService.getCategoryById(id), [id]);
}

// Municipalities hooks
export function useMunicipalities() {
  const cacheKey = generateCacheKey("municipalities");
  return useApiCall(() => apiService.getMunicipalities(), [], cacheKey);
}

export function useMunicipality(id: number) {
  return useApiCall(() => apiService.getMunicipalityById(id), [id]);
}

// Beaches hooks
export function useBeaches(params?: BeachesQueryParams) {
  const cacheKey = generateCacheKey("beaches", params);
  return useApiCall(() => apiService.getBeaches(params), [params], cacheKey);
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

// Cache management utilities
export function clearApiCache(): void {
  apiCache.clear();
}

export function clearCacheByKey(endpoint: string, params?: any): void {
  const cacheKey = generateCacheKey(endpoint, params);
  apiCache.delete(cacheKey);
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: apiCache.size,
    keys: Array.from(apiCache.keys()),
  };
}
