import { ThemedText } from "@/components/ThemedText";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, FlatList, View } from "react-native";

const { width } = Dimensions.get("window");

interface BeachImageCarouselProps {
  beach: Beach;
}

export default function BeachImageCarousel({ beach }: BeachImageCarouselProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();

  const getBeachName = () => {
    return getLocalizedField(beach, "name");
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

  if (!beach?.photo_urls || beach.photo_urls.length === 0) {
    return null;
  }

  const styles = {
    imageCarouselContainer: {
      height: 400,
      position: "relative" as const,
      marginBottom: Spacing.lg,
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
      right: Spacing.xl * 2,
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
  };

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
            <ThemedText style={styles.typeTextOverlay}>{beach.type}</ThemedText>
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
}
