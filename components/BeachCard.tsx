import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface BeachCardProps {
  beach: Beach;
  onPress?: (beach: Beach) => void;
  showLocation?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 4 * Spacing.md) / 2;

export default function BeachCard({
  beach,
  onPress,
  showLocation = true,
}: BeachCardProps) {
  const { themedStyles, colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const getLocalizedField = useLocalizedField();

  const handlePress = () => {
    // Navigate to beach detail page
    router.push(`/beach/${beach.id}`);
    // Also call the optional onPress callback
    onPress?.(beach);
  };

  const getBeachName = () => {
    const name = beach.name_en;
    return name.replace(/beach|beach of/gi, "").trim();
  };

  const getBeachDescription = () => {
    const description = getLocalizedField(beach, "description");
    return description.length > 80
      ? description.substring(0, 80) + "..."
      : description;
  };

  const cardStyles = {
    container: {
      width: CARD_WIDTH,
      marginHorizontal: Spacing.sm,
      marginVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      overflow: "hidden" as const,
      ...shadows.md,
      ...themedStyles.card,
    },
    imageContainer: {
      position: "relative" as const,
      width: "100%" as const,
      height: 200, // Increased from 160 to 200 to make cards taller
    },
    image: {
      width: "100%" as const,
      height: 200, // Increased from 160 to 200 to make cards taller
    },
    placeholderImage: {
      width: "100%" as const,
      height: 200, // Increased from 160 to 200 to make cards taller
      backgroundColor: colors.blue,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    placeholderText: {
      fontSize: 48,
    },
    // Multi-layer blur overlay effect
    blurOverlay1: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "75%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    blurOverlay2: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "65%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    blurOverlay3: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "55%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    blurOverlay4: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "45%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    blurOverlay5: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "35%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    blurOverlay6: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "25%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    contentOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.md,
      paddingTop: Spacing.lg,
    },
    titleContainer: {
      marginBottom: Spacing.xs,
    },
    titleText: {
      color: "#FFFFFF",
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.bold as any,
      lineHeight: Typography.sizes.md * 1.2,
    },
    locationContainer: {
      marginBottom: Spacing.xs,
    },
    locationText: {
      color: "#FFFFFF",
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.medium as any,
      opacity: 0.95,
    },
    descriptionContainer: {
      marginTop: Spacing.xs,
    },
    description: {
      color: "#FFFFFF",
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.light as any,
      lineHeight: Typography.sizes.md,
      opacity: 0.9,
    },
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={cardStyles.container}>
        <View style={cardStyles.imageContainer}>
          {beach.photo_urls && beach.photo_urls.length > 0 ? (
            <Image
              source={{ uri: beach.photo_urls[0] }}
              style={cardStyles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={cardStyles.placeholderImage}>
              <Text style={cardStyles.placeholderText}>🏖️</Text>
            </View>
          )}

          <View style={cardStyles.blurOverlay1} />
          <View style={cardStyles.blurOverlay2} />
          <View style={cardStyles.blurOverlay3} />
          <View style={cardStyles.blurOverlay4} />
          <View style={cardStyles.blurOverlay5} />
          <View style={cardStyles.blurOverlay6} />

          <View style={cardStyles.contentOverlay}>
            <View style={cardStyles.titleContainer}>
              <ThemedText type="title" style={cardStyles.titleText}>
                {getBeachName()}
              </ThemedText>
            </View>

            {showLocation && (
              <View style={cardStyles.locationContainer}>
                <ThemedText style={cardStyles.locationText}>
                  📍 {beach.municipality.name}
                </ThemedText>
              </View>
            )}

            <View style={cardStyles.descriptionContainer}>
              <ThemedText style={cardStyles.description} numberOfLines={3}>
                {getBeachDescription()}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
