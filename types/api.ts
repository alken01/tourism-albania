// API Response Types for Albanian Tourism Data

export interface Municipality {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
  has_beaches: boolean;
  image?: string | null;
}

export interface Category {
  id: number;
  name_en: string;
  name_sq: string;
  created_at?: string;
  updated_at?: string;
  photo?: string;
}

export interface Event {
  id: number;
  event_name_en: string;
  event_name_sq: string;
  from_date: string;
  to_date: string;
  category: Category;
  event_hours: string;
  latitude: number;
  longitude: number;
  municipality: Municipality;
  photo_urls: string[];
}

export interface EventsResponse {
  events: Event[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface Beach {
  id: number;
  name_en: string;
  name_sq: string;
  code: string;
  area: string;
  number: number;
  type: string;
  latitude: string;
  longitude: string;
  is_public: boolean;
  pin_location: string;
  description_en: string;
  description_sq: string;
  area_coordinates: string;
  municipality: Municipality;
  photo_urls: string[];
}

// Place Category for nearby places
export interface PlaceCategory {
  id: number;
  name_en: string;
  name_sq: string;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

// Individual place/recommendation
export interface Place {
  id: number;
  name_en: string;
  name_sq: string;
  latitude: string;
  longitude: string;
  featured: boolean | null;
  distance: number;
  photo_url: string;
}

// Grouped places by category
export interface NearbyPlaceGroup {
  category: PlaceCategory;
  places: Place[];
}

// Detailed beach response with nearby places
export interface DetailedBeach extends Beach {
  nearby_places: NearbyPlaceGroup[];
}

// API Error Response (defined as class in services/api.ts)

// API Query Parameters
export interface EventsQueryParams {
  page?: number;
  category_id?: number;
  municipality_id?: number;
  from_date?: string;
  to_date?: string;
}

export interface FilteredEventsQueryParams {
  from_date?: string;
  to_date?: string;
  audience?: number;
  municipality_id?: number;
  category_id?: number;
}

export interface BeachesQueryParams {
  municipality_id?: number;
  is_public?: boolean;
  type?: string;
}
