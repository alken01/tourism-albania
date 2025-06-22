import { ThemedText } from "@/components/ThemedText";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Place } from "@/types/api";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

interface PlaceCardProps {
  place: Place;
  onPress?: (place: Place) => void;
}

export default function PlaceCard({ place, onPress }: PlaceCardProps) {
  const getLocalizedField = useLocalizedField();
  const { themedStyles, colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const handlePress = () => {
    const latitude = parseFloat(place.latitude);
    const longitude = parseFloat(place.longitude);
    const placeName = encodeURIComponent(getPlaceName());
    const mapsUrl = `https://maps.google.com/maps?q=${placeName}@${latitude},${longitude}`;
    Linking.openURL(mapsUrl);
  };

  const getPlaceName = () => {
    return getLocalizedField(place, "name");
  };

  const styles = {
    container: {
      width: 160,
      marginRight: Spacing.md,
      borderRadius: BorderRadius.lg,
      overflow: "hidden" as const,
      backgroundColor: colors.background,
      ...shadows.sm,
      position: "relative" as const,
    },
    image: {
      width: "100%" as const,
      height: 100,
    },
    gradientOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "80%" as const,
    },
    overlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.sm,
    },
    name: {
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
      marginBottom: Spacing.xs / 2,
      color: colors.textLight,
    },
    distance: {
      fontSize: Typography.sizes.xs,
      color: colors.textLight,
      opacity: 0.9,
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
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.3, 1]}
        style={styles.gradientOverlay}
      />
      <View style={styles.overlay}>
        <ThemedText type="badgeNoBg" numberOfLines={2}>
          {getPlaceName()}
        </ThemedText>
        <ThemedText
          type="badgeNoBg"
          style={{ fontWeight: Typography.weights.regular }}
        >
          {place.distance.toFixed(1)} km
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
