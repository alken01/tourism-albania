import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEvent } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = parseInt(id || "0", 10);
  const navigation = useNavigation();

  const { data: event, loading, error, refetch } = useEvent(eventId);
  const getLocalizedField = useLocalizedField();
  const {
    GlobalStyles,
    themedStyles,
    colors,
    shadows,
    Spacing,
    Typography,
    BorderRadius,
  } = useThemedStyles();

  const getEventName = () => {
    return event ? getLocalizedField(event, "event_name") : "";
  };

  const getEventDescription = () => {
    return event ? getLocalizedField(event, "description") : "";
  };

  // Update navigation title when event data is loaded
  useEffect(() => {
    if (event) {
      navigation.setOptions({
        headerTitle: getEventName(),
      });
    }
  }, [event, navigation]);

  const handleOpenMap = () => {
    if (event?.latitude && event?.longitude) {
      const mapUrl = `https://maps.google.com/?q=${event.latitude},${event.longitude}`;
      Linking.openURL(mapUrl);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEventTime = (timeString: string) => {
    return timeString || "Time TBD";
  };

  const renderImageCarousel = () => {
    if (!event?.photo_urls || event.photo_urls.length === 0) {
      return null;
    }

    return (
      <View style={styles.imageCarouselContainer}>
        <FlatList
          data={event.photo_urls}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.carouselImage}
              contentFit="cover"
              transition={200}
            />
          )}
          keyExtractor={(item, index) => `image-${index}`}
        />

        {/* Overlay Content */}
        <View style={styles.imageOverlay}>
          {/* Top Right Badge */}
          <View style={styles.topRightContainer}>
            {event.category && (
              <View
                style={[
                  styles.categoryBadgeOverlay,
                  { backgroundColor: colors.primary },
                ]}
              >
                <ThemedText style={styles.categoryTextOverlay}>
                  {getLocalizedField(event.category, "name")}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Bottom Left Content */}
          <View style={styles.bottomLeftContainer}>
            <ThemedText style={styles.eventTitleOverlay}>
              {getEventName()}
            </ThemedText>
            <ThemedText style={styles.locationTextOverlay}>
              📅 {formatEventDate(event.from_date)}
              {event.to_date &&
                event.to_date !== event.from_date &&
                ` - ${formatEventDate(event.to_date)}`}
            </ThemedText>
            <ThemedText style={styles.locationTextOverlay}>
              📍 {event.municipality.name}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView
        style={[GlobalStyles.loadingContainer, themedStyles.background]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[GlobalStyles.loadingText, themedStyles.textSecondary]}
        >
          Loading event details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !event) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          {error || "Event not found"}
        </ThemedText>
        <TouchableOpacity
          style={[GlobalStyles.button, { backgroundColor: colors.primary }]}
          onPress={refetch}
        >
          <ThemedText
            style={[GlobalStyles.buttonText, { color: colors.textLight }]}
          >
            Try Again
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const styles = {
    container: {
      flex: 1,
      ...themedStyles.background,
    },
    imageCarouselContainer: {
      height: 400,
      position: "relative" as const,
    },
    carouselImage: {
      width: width,
      height: 400,
    },
    imageOverlay: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    topRightContainer: {
      position: "absolute" as const,
      top: 60,
      right: Spacing.md,
    },
    categoryBadgeOverlay: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.primary,
    },
    categoryTextOverlay: {
      color: colors.textLight,
      fontSize: Typography.sizes.caption,
      fontWeight: "600" as const,
      textTransform: "uppercase" as const,
    },
    bottomLeftContainer: {
      position: "absolute" as const,
      bottom: Spacing.lg,
      left: Spacing.md,
      right: Spacing.md,
    },
    eventTitleOverlay: {
      color: colors.textLight,
      fontSize: Typography.sizes.xxl,
      fontWeight: "bold" as const,
      marginBottom: Spacing.xs,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    locationTextOverlay: {
      color: colors.textLight,
      fontSize: Typography.sizes.sm,
      opacity: 0.9,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    contentContainer: {
      padding: Spacing.md,
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: "600" as const,
      marginBottom: Spacing.sm,
      ...themedStyles.text,
    },
    detailsGrid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: Spacing.sm,
    },
    detailItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.surface,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      minWidth: "45%",
    },
    detailIcon: {
      marginRight: Spacing.xs,
    },
    detailText: {
      fontSize: Typography.sizes.sm,
      ...themedStyles.text,
    },
    description: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.sizes.md * 1.5,
      ...themedStyles.textSecondary,
    },
    mapButton: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: Spacing.md,
    },
    mapButtonText: {
      color: colors.textLight,
      fontSize: Typography.sizes.md,
      fontWeight: "600" as const,
      marginLeft: Spacing.xs,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {renderImageCarousel()}

      <View style={styles.contentContainer}>
        {/* Event Details Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Event Details</ThemedText>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailIcon}>📅</ThemedText>
              <ThemedText style={styles.detailText}>
                {formatEventDate(event.from_date)}
              </ThemedText>
            </View>

            {event.to_date && event.to_date !== event.from_date && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailIcon}>📅</ThemedText>
                <ThemedText style={styles.detailText}>
                  Until {formatEventDate(event.to_date)}
                </ThemedText>
              </View>
            )}

            {event.event_hours && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailIcon}>⏰</ThemedText>
                <ThemedText style={styles.detailText}>
                  {event.event_hours}
                </ThemedText>
              </View>
            )}

            <View style={styles.detailItem}>
              <ThemedText style={styles.detailIcon}>📍</ThemedText>
              <ThemedText style={styles.detailText}>
                {event.municipality.name}
              </ThemedText>
            </View>

            {event.category && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailIcon}>🏷️</ThemedText>
                <ThemedText style={styles.detailText}>
                  {getLocalizedField(event.category, "name")}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Description Section */}
        {getEventDescription() && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              About This Event
            </ThemedText>
            <ThemedText style={styles.description}>
              {getEventDescription()}
            </ThemedText>
          </View>
        )}

        {/* Map Button */}
        {event.latitude && event.longitude && (
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <ThemedText style={styles.detailIcon}>🗺️</ThemedText>
            <ThemedText style={styles.mapButtonText}>View on Map</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
