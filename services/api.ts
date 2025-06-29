import {
  Beach,
  BeachesQueryParams,
  Category,
  DetailedBeach,
  Event,
  EventsQueryParams,
  EventsResponse,
  FilteredEventsQueryParams,
  Municipality,
} from "@/types/api";

const BASE_URL = "https://tea2.base.al/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  try {
    let url = `${BASE_URL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0
    );
  }
}

export const apiService = {
  // Events API
  async getEvents(params?: EventsQueryParams): Promise<EventsResponse> {
    return fetchApi<EventsResponse>("/events", params);
  },

  async getAllEvents(): Promise<Event[]> {
    const allEvents: Event[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const response = await this.getEvents({ page: currentPage });
        allEvents.push(...response.events);

        // Check if there are more pages
        hasMorePages = response.current_page < response.total_pages;
        currentPage++;
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        throw error;
      }
    }

    return allEvents;
  },

  async getFilteredEvents(
    params?: FilteredEventsQueryParams
  ): Promise<Event[]> {
    return fetchApi<Event[]>("/events/filter_events", params);
  },

  async getEventById(id: number): Promise<Event> {
    return fetchApi<Event>(`/events/${id}`);
  },

  // Categories API
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>("/categories");
  },

  async getCategoryById(id: number): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`);
  },

  // Municipalities API
  async getMunicipalities(): Promise<Municipality[]> {
    return fetchApi<Municipality[]>("/municipalities");
  },

  async getMunicipalityById(id: number): Promise<Municipality> {
    return fetchApi<Municipality>(`/municipalities/${id}`);
  },

  // Beaches API
  async getBeaches(params?: BeachesQueryParams): Promise<Beach[]> {
    return fetchApi<Beach[]>("/beaches", params);
  },

  async getBeachById(id: number): Promise<DetailedBeach> {
    return fetchApi<DetailedBeach>(`/beaches/${id}`);
  },

  // Utility functions for filtered data
  async getEventsByCategory(
    categoryId: number,
    page: number = 1
  ): Promise<EventsResponse> {
    return this.getEvents({ category_id: categoryId, page });
  },

  async getEventsByMunicipality(
    municipalityId: number,
    page: number = 1
  ): Promise<EventsResponse> {
    return this.getEvents({ municipality_id: municipalityId, page });
  },

  async getFilteredEventsByMunicipality(
    municipalityId: number,
    fromDate?: string,
    toDate?: string,
    audience?: number
  ): Promise<Event[]> {
    return this.getFilteredEvents({
      municipality_id: municipalityId,
      from_date: fromDate,
      to_date: toDate,
      audience,
    });
  },

  async getPublicBeaches(): Promise<Beach[]> {
    return this.getBeaches({ is_public: true });
  },

  async getBeachesByMunicipality(municipalityId: number): Promise<Beach[]> {
    return this.getBeaches({ municipality_id: municipalityId });
  },
};

export { ApiError };
