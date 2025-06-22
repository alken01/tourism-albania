import PlaceCard from "@/components/PlaceCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { NearbyPlaceGroup, Place } from "@/types/api";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/beaches");
    }
  };

  const handleOpenMap = () => {
    if (beach?.pin_location) {
      Linking.openURL(beach.pin_location);
    }
  };

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
      </View>
    );
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <PlaceCard
      place={item}
      onPress={(place) => console.log("Place selected:", place.name_en)}
    />
  );

  const renderNearbyCategory = ({ item }: { item: NearbyPlaceGroup }) => {
    if (!item.places || item.places.length === 0) {
      return null;
    }

    return (
      <View style={styles.categorySection}>
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
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      padding: Spacing.lg,
      paddingTop: Spacing.xl * 2,
      ...themedStyles.background,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      ...shadows.sm,
      marginRight: Spacing.md,
    },
    headerTitle: {
      flex: 1,
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      ...themedStyles.text,
    },
    imageCarouselContainer: {
      height: 250,
    },
    carouselImage: {
      width: width,
      height: 250,
    },
    content: {
      flex: 1,
    },
    infoSection: {
      padding: Spacing.lg,
    },
    titleRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: Spacing.md,
    },
    beachTitle: {
      flex: 1,
      fontSize: Typography.sizes.xl,
      fontWeight: Typography.weights.bold,
      marginRight: Spacing.md,
      ...themedStyles.text,
    },
    typeBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    typeText: {
      color: colors.textLight,
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      textTransform: "uppercase" as const,
    },
    locationRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: Spacing.lg,
    },
    locationText: {
      flex: 1,
      fontSize: Typography.sizes.md,
      color: colors.textSecondary,
      marginRight: Spacing.md,
    },
    mapButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ThemedText style={{ fontSize: 18 }}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {getBeachName()}
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.beachTitle}>{getBeachName()}</ThemedText>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(beach.type) },
              ]}
            >
              <ThemedText style={styles.typeText}>{beach.type}</ThemedText>
            </View>
          </View>

          <View style={styles.locationRow}>
            <ThemedText style={styles.locationText}>
              📍 {beach.municipality.name} • {beach.area} ha
            </ThemedText>
            <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
              <ThemedText style={styles.mapButtonText}>🗺️ View Map</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.description}>
            {getBeachDescription()}
          </ThemedText>
        </View>

        {beach.nearby_places && beach.nearby_places.length > 0 && (
          <View style={styles.nearbySection}>
            <ThemedText style={styles.nearbyTitle}>
              Nearby Recommendations
            </ThemedText>
            <FlatList
              data={beach.nearby_places}
              renderItem={renderNearbyCategory}
              keyExtractor={(item) => `category-${item.category.id}`}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
