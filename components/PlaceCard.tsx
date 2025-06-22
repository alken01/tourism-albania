import { ThemedText } from "@/components/ThemedText";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Place } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface PlaceCardProps {
  place: Place;
  onPress?: (place: Place) => void;
}

export default function PlaceCard({ place, onPress }: PlaceCardProps) {
  const getLocalizedField = useLocalizedField();
  const { themedStyles, colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const handlePress = () => {
    onPress?.(place);
  };

  const getPlaceName = () => {
    return getLocalizedField(place, "name");
  };

  const styles = {
    container: {
      width: 200,
      marginRight: Spacing.md,
      borderRadius: BorderRadius.lg,
      overflow: "hidden" as const,
      backgroundColor: colors.background,
      ...shadows.sm,
    },
    image: {
      width: "100%" as const,
      height: 120,
    },
    content: {
      padding: Spacing.md,
    },
    name: {
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      marginBottom: Spacing.xs,
      ...themedStyles.text,
    },
    distance: {
      fontSize: Typography.sizes.xs,
      color: colors.textSecondary,
    },
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: place.photo_url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {getPlaceName()}
        </ThemedText>
        <ThemedText style={styles.distance}>
          📍 {place.distance.toFixed(1)} km away
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
