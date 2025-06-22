import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Event } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
  preferredLanguage?: "en" | "sq";
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32; // Account for horizontal margins

export default function EventCard({
  event,
  onPress,
  preferredLanguage = "en",
}: EventCardProps) {
  const { themedStyles, colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const handlePress = () => {
    onPress?.(event);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventName = () => {
    return preferredLanguage === "sq" && event.event_name_sq
      ? event.event_name_sq.replace(/"/g, "") // Remove quotes from name
      : event.event_name_en.replace(/"/g, "");
  };

  const getCategoryName = () => {
    return preferredLanguage === "sq"
      ? event.category.name_sq
      : event.category.name_en;
  };

  const cardStyles = {
    container: {
      width: CARD_WIDTH,
      marginHorizontal: Spacing.lg,
      marginVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      overflow: "hidden" as const,
      ...shadows.md,
      ...themedStyles.card,
    },
    image: {
      width: "100%" as const,
      height: 200,
    },
    content: {
      padding: Spacing.lg,
    },
    categoryBadge: {
      alignSelf: "flex-start" as const,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Spacing.sm - 2,
      marginBottom: Spacing.sm,
    },
    categoryText: {
      color: colors.textLight,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
    },
    title: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      marginBottom: Spacing.sm,
      lineHeight: Typography.sizes.lg * Typography.lineHeights.normal,
    },
    dateContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: Spacing.sm - 2,
    },
    dateText: {
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.medium,
      color: colors.textSecondary,
    },
    timeText: {
      fontSize: Typography.sizes.xs,
      color: colors.textMuted,
    },
    locationContainer: {
      marginTop: Spacing.xs,
    },
    locationText: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
    },
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={cardStyles.container}>
        {event.photo_urls && event.photo_urls.length > 0 && (
          <Image
            source={{ uri: event.photo_urls[0] }}
            style={cardStyles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={cardStyles.content}>
          <View style={cardStyles.categoryBadge}>
            <Text style={cardStyles.categoryText}>{getCategoryName()}</Text>
          </View>

          <ThemedText
            style={[cardStyles.title, themedStyles.text]}
            numberOfLines={2}
          >
            {getEventName()}
          </ThemedText>

          <View style={cardStyles.dateContainer}>
            <ThemedText style={cardStyles.dateText}>
              {formatDate(event.from_date)}
              {event.from_date !== event.to_date &&
                ` - ${formatDate(event.to_date)}`}
            </ThemedText>

            {event.event_hours && event.event_hours !== "N/A" && (
              <ThemedText style={cardStyles.timeText}>
                🕒 {event.event_hours}
              </ThemedText>
            )}
          </View>

          <View style={cardStyles.locationContainer}>
            <ThemedText style={cardStyles.locationText}>
              📍 {event.municipality.name}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
