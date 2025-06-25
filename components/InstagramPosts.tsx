import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  generateMockInstagramPosts,
  InstagramPost,
} from "@/services/instagram";
import { Image } from "expo-image";
import { Heart, Instagram, MessageCircle, Share } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface InstagramPostsProps {
  hashtag?: string;
  location?: string;
  maxPosts?: number;
  title?: string;
  subtitle?: string;
}

export default function InstagramPosts({
  hashtag,
  location,
  maxPosts = 6,
  title = "Instagram Posts",
  subtitle,
}: InstagramPostsProps) {
  const { colors, Spacing, BorderRadius, Typography } = useThemedStyles();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = hashtag || location || "";

  // Fetch Instagram posts
  const fetchInstagramPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For development, use mock data
      const mockPosts = generateMockInstagramPosts(maxPosts);
      setPosts(mockPosts);
    } catch (err) {
      setError("Failed to load Instagram posts");
      console.error("Instagram API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchInstagramPosts();
    }
  }, [searchQuery, maxPosts]);

  const handlePostPress = async (post: InstagramPost) => {
    try {
      await Linking.openURL(post.permalink);
    } catch (err) {
      console.error("Failed to open Instagram post:", err);
    }
  };

  const formatCaption = (caption: string) => {
    if (caption.length > 100) {
      return caption.substring(0, 100) + "...";
    }
    return caption;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const getPostSize = () => {
    // Instagram-like square posts, slightly larger
    const postWidth = 280;
    const postHeight = 350; // Account for content below image
    return { width: postWidth, height: postHeight };
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.md,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: Spacing.sm,
    },
    title: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
    },
    subtitle: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    loadingContainer: {
      padding: Spacing.xl,
      alignItems: "center",
    },
    loadingText: {
      marginTop: Spacing.md,
      color: colors.textSecondary,
    },
    errorContainer: {
      padding: Spacing.xl,
      alignItems: "center",
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
    },
    postsContainer: {
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.lg,
    },
    postItem: {
      backgroundColor: colors.background,
      marginRight: Spacing.lg,
      borderRadius: BorderRadius.lg,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    postImage: {
      width: 280,
      height: 280,
    },
    postContent: {
      padding: Spacing.md,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    usernameContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    instagramIcon: {
      marginRight: Spacing.xs,
    },
    username: {
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    actionButton: {
      marginRight: Spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      fontSize: Typography.sizes.xs,
      color: colors.textSecondary,
      marginLeft: Spacing.xs,
    },
    postCaption: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    },
    emptyContainer: {
      padding: Spacing.xl,
      alignItems: "center",
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

  const renderPost = ({ item }: { item: InstagramPost }) => {
    const postSize = getPostSize();

    return (
      <TouchableOpacity
        style={[styles.postItem, postSize]}
        onPress={() => handlePostPress(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.media_url }}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <View style={styles.usernameContainer}>
              <Instagram
                size={14}
                color="#E4405F"
                style={styles.instagramIcon}
              />
              <ThemedText style={styles.username}>
                @{item.username || "user"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.postActions}>
            <View style={styles.actionButton}>
              <Heart size={16} color={colors.textSecondary} />
              <ThemedText style={styles.actionText}>
                {formatNumber(item.like_count || 0)}
              </ThemedText>
            </View>
            <View style={styles.actionButton}>
              <MessageCircle size={16} color={colors.textSecondary} />
              <ThemedText style={styles.actionText}>
                {formatNumber(item.comments_count || 0)}
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {item.caption && (
            <ThemedText style={styles.postCaption} numberOfLines={3}>
              {formatCaption(item.caption)}
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!searchQuery) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <CardHeader>
        <View style={styles.headerContent}>
          <Instagram size={20} color="#E4405F" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle && (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
      </CardHeader>
      <CardContent>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={styles.loadingText}>Loading posts...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No Instagram posts found for this location
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.postsContainer}
            snapToInterval={296} // 280 width + 16 margin
            decelerationRate="fast"
          />
        )}
      </CardContent>
    </Card>
  );
}

// Hook for Instagram API integration
export const useInstagramPosts = (hashtag?: string, location?: string) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!hashtag && !location) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual Instagram API calls
      // This is where you would integrate with Instagram Basic Display API
      // or Instagram Graph API depending on your needs

      /*
      Example API call structure:
      
      const accessToken = 'YOUR_ACCESS_TOKEN';
      const fields = 'id,media_url,media_type,caption,permalink,timestamp';
      
      if (hashtag) {
        // Search by hashtag using Instagram Graph API
        const response = await fetch(
          `https://graph.instagram.com/ig_hashtag_search?user_id=${userId}&q=${hashtag}&access_token=${accessToken}`
        );
      } else if (location) {
        // Search by location (this requires additional implementation)
        // Instagram doesn't directly support location search in basic API
      }
      */

      // For now, return empty array in production
      setPosts([]);
    } catch (err) {
      setError("Failed to fetch Instagram posts");
      console.error("Instagram API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, fetchPosts };
};
