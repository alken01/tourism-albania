import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
const CARD_WIDTH = (width - 48) / 2; // Two cards per row with margins

export default function BeachCard({
  beach,
  onPress,
  showLocation = true,
}: BeachCardProps) {
  const {
    GlobalStyles,
    themedStyles,
    colors,
    shadows,
    Spacing,
    Typography,
    BorderRadius,
  } = useThemedStyles();

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
    image: {
      width: "100%" as const,
      height: 120,
    },
    content: {
      padding: Spacing.md,
    },
    header: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: Spacing.sm,
    },
    typeBadge: {
      paddingHorizontal: Spacing.sm - 2,
      paddingVertical: Spacing.xs - 1,
      borderRadius: BorderRadius.xs,
    },
    typeText: {
      color: colors.textLight,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
      textTransform: "uppercase" as const,
    },
    publicBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: Spacing.sm - 2,
      paddingVertical: Spacing.xs - 1,
      borderRadius: BorderRadius.xs,
    },
    publicText: {
      color: colors.textLight,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
    },
    title: {
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.bold,
      marginBottom: Spacing.sm - 2,
      lineHeight: Typography.sizes.sm * Typography.lineHeights.tight,
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
        {beach.photo_urls && beach.photo_urls.length > 0 && (
          <Image
            source={{ uri: beach.photo_urls[0] }}
            style={cardStyles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={cardStyles.content}>
          <View style={cardStyles.header}>
            <View
              style={[
                cardStyles.typeBadge,
                { backgroundColor: getTypeColor(beach.type) },
              ]}
            >
              <Text style={cardStyles.typeText}>{beach.type}</Text>
            </View>
          </View>

          <ThemedText
            style={[cardStyles.title, themedStyles.text]}
            numberOfLines={2}
          >
            {getBeachName()}
          </ThemedText>

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
