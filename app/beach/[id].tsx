import PlaceCard from "@/components/PlaceCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { NearbyPlaceGroup, Place } from "@/types/api";
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

export default function BeachDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beachId = parseInt(id || "0", 10);
  const navigation = useNavigation();

  const { data: beach, loading, error, refetch } = useBeach(beachId);
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

  const getBeachName = () => {
    return beach ? getLocalizedField(beach, "name") : "";
  };

  const getBeachDescription = () => {
    return beach ? getLocalizedField(beach, "description") : "";
  };

  const getPlaceName = (place: Place) => {
    return getLocalizedField(place, "name");
  };

  const getCategoryName = (category: { name_en: string; name_sq: string }) => {
    return getLocalizedField(category, "name");
  };

  // Update navigation title when beach data is loaded
  useEffect(() => {
    if (beach) {
      navigation.setOptions({
        headerTitle: getBeachName(),
      });
    }
  }, [beach, navigation]);

  const handleOpenMap = () => {
    if (beach?.pin_location) {
      Linking.openURL(beach.pin_location);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "publike":
        return colors.success;
      case "kontrate":
        return colors.warning;
      case "e menaxhuar":
        return colors.info;
      default:
        return colors.textMuted;
    }
  };

  const renderImageCarousel = () => {
    if (!beach?.photo_urls || beach.photo_urls.length === 0) {
      return null;
    }

    return (
      <View style={styles.imageCarouselContainer}>
        <FlatList
          data={beach.photo_urls}
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
            <View
              style={[
                styles.typeBadgeOverlay,
                { backgroundColor: getTypeColor(beach.type) },
              ]}
            >
              <ThemedText style={styles.typeTextOverlay}>
                {beach.type}
              </ThemedText>
            </View>
          </View>

          {/* Bottom Left Content */}
          <View style={styles.bottomLeftContainer}>
            <ThemedText style={styles.beachTitleOverlay}>
              {getBeachName()}
            </ThemedText>
            <ThemedText style={styles.locationTextOverlay}>
              📍 {beach.municipality.name} • {beach.area} ha
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <PlaceCard
      place={item}
      onPress={(place) => console.log("Place selected:", place.name_en)}
    />
  );

  if (loading) {
    return (
      <ThemedView
        style={[GlobalStyles.loadingContainer, themedStyles.background]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[GlobalStyles.loadingText, themedStyles.textSecondary]}
        >
          Loading beach details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !beach) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          {error || "Beach not found"}
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
      height: 400, // Increased height for better hero effect
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
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay for text readability
    },
    topRightContainer: {
      position: "absolute" as const,
      top: Spacing.xl,
      right: Spacing.lg,
    },
    typeBadgeOverlay: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    typeTextOverlay: {
      color: colors.textLight,
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      textTransform: "uppercase" as const,
    },
    bottomLeftContainer: {
      position: "absolute" as const,
      bottom: Spacing.xl,
      left: Spacing.lg,
      right: Spacing.xl * 2, // Leave space for potential map button
    },
    beachTitleOverlay: {
      fontSize: Typography.sizes.xxl,
      fontWeight: Typography.weights.bold,
      color: colors.textLight,
      marginBottom: Spacing.xs,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    locationTextOverlay: {
      fontSize: Typography.sizes.md,
      color: colors.textLight,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    content: {
      flex: 1,
    },
    infoSection: {
      padding: Spacing.lg,
    },
    mapButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      alignSelf: "flex-start" as const,
      marginBottom: Spacing.lg,
    },
    mapButtonText: {
      color: colors.textLight,
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      marginLeft: Spacing.xs,
    },
    description: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
      color: colors.text,
      marginBottom: Spacing.xl,
    },
    nearbySection: {
      backgroundColor: colors.backgroundSecondary,
      paddingTop: Spacing.lg,
    },
    nearbyTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      ...themedStyles.text,
    },
    categorySection: {
      marginBottom: Spacing.lg,
    },
    categoryTitle: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      ...themedStyles.text,
    },
    placesContainer: {
      paddingHorizontal: Spacing.lg,
    },
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}

        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <ThemedText style={styles.mapButtonText}>🗺️ View Map</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.description}>
            {getBeachDescription()}
          </ThemedText>
        </View>

        {beach.nearby_places && beach.nearby_places.length > 0 && (
          <View style={styles.nearbySection}>
            <ThemedText style={styles.nearbyTitle}>
              Nearby Recommendations
            </ThemedText>
            {beach.nearby_places.map((item: NearbyPlaceGroup) => {
              if (!item.places || item.places.length === 0) {
                return null;
              }

              return (
                <View
                  key={`category-${item.category.id}`}
                  style={styles.categorySection}
                >
                  <ThemedText style={styles.categoryTitle}>
                    {getCategoryName(item.category)} ({item.places.length})
                  </ThemedText>
                  <FlatList
                    data={item.places}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderPlaceItem}
                    keyExtractor={(place) => `place-${place.id}`}
                    contentContainerStyle={styles.placesContainer}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
