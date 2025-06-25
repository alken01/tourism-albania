// Instagram API Service
// This service handles Instagram API integration for fetching posts

export interface InstagramPost {
  id: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  permalink: string;
  timestamp: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramConfig {
  accessToken: string;
  userId: string;
  apiVersion: string;
}

class InstagramService {
  private config: InstagramConfig | null = null;

  // Initialize the service with your Instagram app credentials
  initialize(config: InstagramConfig) {
    this.config = config;
  }

  // Search posts by hashtag using Instagram Graph API
  async searchByHashtag(
    hashtag: string,
    limit: number = 6
  ): Promise<InstagramPost[]> {
    if (!this.config) {
      throw new Error("Instagram service not initialized");
    }

    try {
      // Step 1: Get hashtag ID
      const hashtagSearchUrl = `https://graph.instagram.com/ig_hashtag_search?user_id=${this.config.userId}&q=${hashtag}&access_token=${this.config.accessToken}`;

      const hashtagResponse = await fetch(hashtagSearchUrl);
      const hashtagData = await hashtagResponse.json();

      if (!hashtagData.data || hashtagData.data.length === 0) {
        return [];
      }

      const hashtagId = hashtagData.data[0].id;

      // Step 2: Get recent media for this hashtag
      const mediaUrl = `https://graph.instagram.com/${hashtagId}/recent_media?user_id=${this.config.userId}&fields=id,media_url,media_type,caption,permalink,timestamp,username&limit=${limit}&access_token=${this.config.accessToken}`;

      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();

      return mediaData.data || [];
    } catch (error) {
      console.error("Error fetching Instagram posts by hashtag:", error);
      throw error;
    }
  }

  // Search posts by location (requires additional setup)
  async searchByLocation(
    locationName: string,
    limit: number = 6
  ): Promise<InstagramPost[]> {
    // Note: Instagram doesn't provide direct location search in their basic API
    // You would need to implement this using alternative methods like:
    // 1. Predefine location hashtags
    // 2. Use location-based hashtags
    // 3. Implement a custom mapping system

    // For now, we'll search using location-based hashtags
    const locationHashtag = locationName.toLowerCase().replace(/\s+/g, "");
    return this.searchByHashtag(locationHashtag, limit);
  }

  // Get posts from a specific user (requires user to authorize your app)
  async getUserPosts(
    userId: string,
    limit: number = 6
  ): Promise<InstagramPost[]> {
    if (!this.config) {
      throw new Error("Instagram service not initialized");
    }

    try {
      const url = `https://graph.instagram.com/${userId}/media?fields=id,media_url,media_type,caption,permalink,timestamp&limit=${limit}&access_token=${this.config.accessToken}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.data || [];
    } catch (error) {
      console.error("Error fetching user Instagram posts:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const instagramService = new InstagramService();

// Helper function to generate search terms for beaches
export const generateBeachHashtags = (
  beachName: string,
  municipalityName: string
): string[] => {
  const cleanBeachName = beachName
    .toLowerCase()
    .replace(/beach|plazh/gi, "")
    .trim()
    .replace(/\s+/g, "");
  const cleanMunicipalityName = municipalityName
    .toLowerCase()
    .replace(/\s+/g, "");

  return [
    `${cleanBeachName}beach`,
    `${cleanBeachName}`,
    `${cleanMunicipalityName}beach`,
    `${cleanMunicipalityName}`,
    "albanianriviera",
    "albania",
    "visitalbania",
    "albaniancoast",
  ];
};

// Environment configuration - you'll need to set these in your environment
export const getInstagramConfig = (): InstagramConfig => {
  // In production, these should come from environment variables
  // For development, you can set them here temporarily
  return {
    accessToken: process.env.EXPO_PUBLIC_INSTAGRAM_ACCESS_TOKEN || "",
    userId: process.env.EXPO_PUBLIC_INSTAGRAM_USER_ID || "",
    apiVersion: "v18.0",
  };
};

// Mock data generator for development/testing
export const generateMockInstagramPosts = (
  count: number = 6
): InstagramPost[] => {
  const mockCaptions = [
    "Beautiful sunset at the beach 🌅 #beach #sunset #albania",
    "Crystal clear waters 💙 #albanianriviera #beach",
    "Perfect day for swimming! 🏊‍♀️ #beachday",
    "Beach paradise found! 🏖️ #albania #beach",
    "Amazing views from this hidden gem 📸 #hiddenbeach",
    "Summer vibes all day long ☀️ #summervibes #albania",
  ];

  const mockUsernames = [
    "beach_lover_al",
    "travel_albania",
    "summer_vibes",
    "explore_albania",
    "riviera_adventures",
    "albanian_explorer",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `mock_${index + 1}`,
    media_url: `https://picsum.photos/400/400?random=${index + 1}`,
    media_type: "IMAGE" as const,
    caption: mockCaptions[index % mockCaptions.length],
    permalink: `https://instagram.com/p/mock${index + 1}`,
    timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    username: mockUsernames[index % mockUsernames.length],
    like_count: Math.floor(Math.random() * 1000) + 50,
    comments_count: Math.floor(Math.random() * 50) + 5,
  }));
};
