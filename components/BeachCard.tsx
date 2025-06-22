import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
const CARD_WIDTH = (width - Spacing.lg) / 2;

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
    return getLocalizedField(beach, "name");
  };

  const getBeachDescription = () => {
    const description = getLocalizedField(beach, "description");
    return description.length > 100
      ? description.substring(0, 100) + "..."
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
      height: 120,
    },
    image: {
      width: "100%" as const,
      height: 120,
    },
    placeholderImage: {
      width: "100%" as const,
      height: 120,
      backgroundColor: colors.blue,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    placeholderText: {
      fontSize: 48,
    },
    typeText: {
      color: colors.textLight,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
      textTransform: "uppercase" as const,
    },
    blurOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
    },
    darkOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    imageTitleContainer: {
      position: "absolute" as const,
      bottom: Spacing.sm,
      left: Spacing.sm,
      right: Spacing.sm,
      zIndex: 2,
    },
    imageTitle: {
      color: colors.textLight,
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.bold,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    content: {
      padding: Spacing.md,
    },
    locationContainer: {
      marginBottom: Spacing.sm - 2,
    },
    locationText: {
      fontSize: Typography.sizes.xs,
      color: colors.textSecondary,
    },
    description: {
      fontSize: Typography.sizes.xs - 1,
      color: colors.textMuted,
      lineHeight: Typography.sizes.xs * Typography.lineHeights.normal,
      marginBottom: Spacing.sm,
    },
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <ThemedView style={cardStyles.container}>
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

          <View style={cardStyles.imageTitleContainer}>
            <Text style={cardStyles.imageTitle} numberOfLines={2}>
              {getBeachName()}
            </Text>
          </View>
        </View>

        <View style={cardStyles.content}>
          {showLocation && (
            <View style={cardStyles.locationContainer}>
              <ThemedText style={cardStyles.locationText}>
                📍 {beach.municipality.name}
              </ThemedText>
            </View>
          )}

          <ThemedText style={cardStyles.description} numberOfLines={3}>
            {getBeachDescription()}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
