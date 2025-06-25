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

interface GroupedEvents {
  municipality: string;
  municipalityId: number;
  events: Event[];
  totalEvents: number;
  displayEvents: Event[]; // First 4 events for display
  hasMore: boolean; // True if more than 4 events
}

// Cache configuration
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const DAILY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// In-memory cache storage
const apiCache = new Map<string, CacheEntry<any>>();

// Daily cache for all events
const DAILY_EVENTS_CACHE_KEY = "daily-all-events";

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

function setCachedData<T>(
  cacheKey: string,
  data: T,
  ttl: number = CACHE_TTL
): void {
  const now = Date.now();
  apiCache.set(cacheKey, {
    data,
    timestamp: now,
    expiry: now + ttl,
  });
}

// Check if daily cache is still valid
function isDailyCacheValid(): boolean {
  const cached = apiCache.get(DAILY_EVENTS_CACHE_KEY);
  if (!cached) return false;

  const now = Date.now();
  const cacheDate = new Date(cached.timestamp);
  const nowDate = new Date(now);

  // Check if it's the same day
  return cacheDate.toDateString() === nowDate.toDateString();
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

// Daily cached all events hook with municipality grouping
export function useDailyAllEvents(): ApiState<GroupedEvents[]> & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<ApiState<GroupedEvents[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAndGroupEvents = useCallback(
    async (forceRefresh: boolean = false) => {
      // Check daily cache first
      if (!forceRefresh && isDailyCacheValid()) {
        const cachedData = getCachedData<Event[]>(DAILY_EVENTS_CACHE_KEY);
        if (cachedData) {
          const groupedEvents = groupEventsByMunicipality(cachedData);
          setState({ data: groupedEvents, loading: false, error: null });
          return;
        }
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const allEvents = await apiService.getAllEvents();

        // Cache for 24 hours (daily cache)
        setCachedData(DAILY_EVENTS_CACHE_KEY, allEvents, DAILY_CACHE_TTL);

        const groupedEvents = groupEventsByMunicipality(allEvents);
        setState({ data: groupedEvents, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof ApiError
              ? error.message
              : "Failed to fetch events",
        });
      }
    },
    []
  );

  useEffect(() => {
    fetchAndGroupEvents();
  }, [fetchAndGroupEvents]);

  return {
    ...state,
    refetch: () => fetchAndGroupEvents(true),
  };
}

// Featured municipalities hook (top 5 municipalities by event count)
export function useFeaturedMunicipalities(): ApiState<GroupedEvents[]> & {
  refetch: () => Promise<void>;
} {
  const {
    data: allGroupedEvents,
    loading,
    error,
    refetch,
  } = useDailyAllEvents();

  const [featuredState, setFeaturedState] = useState<ApiState<GroupedEvents[]>>(
    {
      data: null,
      loading: true,
      error: null,
    }
  );

  useEffect(() => {
    if (loading) {
      setFeaturedState((prev) => ({ ...prev, loading: true }));
      return;
    }

    if (error) {
      setFeaturedState({ data: null, loading: false, error });
      return;
    }

    if (allGroupedEvents) {
      const featuredMunicipalities = allGroupedEvents.slice(0, 5); // Top 5 municipalities
      setFeaturedState({
        data: featuredMunicipalities,
        loading: false,
        error: null,
      });
    }
  }, [allGroupedEvents, loading, error]);

  return {
    ...featuredState,
    refetch,
  };
}

// Search municipalities hook - returns all municipalities that match search term
export function useSearchMunicipalities(
  searchTerm: string
): ApiState<GroupedEvents[]> & { refetch: () => Promise<void> } {
  const {
    data: allGroupedEvents,
    loading,
    error,
    refetch,
  } = useDailyAllEvents();

  const [searchState, setSearchState] = useState<ApiState<GroupedEvents[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (loading) {
      setSearchState((prev) => ({ ...prev, loading: true }));
      return;
    }

    if (error) {
      setSearchState({ data: null, loading: false, error });
      return;
    }

    if (allGroupedEvents) {
      if (!searchTerm.trim()) {
        // If no search term, return all municipalities except the top 5 featured ones
        const nonFeaturedMunicipalities = allGroupedEvents.slice(5);
        setSearchState({
          data: nonFeaturedMunicipalities,
          loading: false,
          error: null,
        });
      } else {
        // Filter municipalities by search term
        const filteredMunicipalities = allGroupedEvents.filter((group) =>
          group.municipality.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchState({
          data: filteredMunicipalities,
          loading: false,
          error: null,
        });
      }
    }
  }, [allGroupedEvents, searchTerm, loading, error]);

  return {
    ...searchState,
    refetch,
  };
}

// Helper function to group and rank events by municipality
function groupEventsByMunicipality(events: Event[]): GroupedEvents[] {
  const groupedMap = new Map<string, Event[]>();

  // Group events by municipality
  events.forEach((event) => {
    const municipalityName = event.municipality.name;
    if (!groupedMap.has(municipalityName)) {
      groupedMap.set(municipalityName, []);
    }
    groupedMap.get(municipalityName)!.push(event);
  });

  // Convert to array and sort by event count (most events first)
  const groupedEvents: GroupedEvents[] = Array.from(groupedMap.entries())
    .map(([municipality, events]) => ({
      municipality,
      municipalityId: events[0].municipality.id,
      events,
      totalEvents: events.length,
      displayEvents: events.slice(0, 4), // Show only first 4 events
      hasMore: events.length > 4,
    }))
    .sort((a, b) => b.totalEvents - a.totalEvents); // Sort by event count (descending)

  return groupedEvents;
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

// Cache management functions
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

// Export the GroupedEvents interface for use in components
export type { GroupedEvents };
