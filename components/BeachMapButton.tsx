import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface BeachMapButtonProps {
  beach: Beach;
  size?: "small" | "medium";
  style?: any;
}

export default function BeachMapButton({ beach }: BeachMapButtonProps) {
  const { colors } = useThemedStyles();

  const handlePress = () => {
    // Navigate to the map tab with the beach coordinates
    if (beach.latitude && beach.longitude) {
      router.push({
        pathname: "/(tabs)/map",
        params: {
          focusBeachId: beach.id,
          latitude: beach.latitude,
          longitude: beach.longitude,
        },
      });
    }
  };

  if (!beach.latitude || !beach.longitude) {
    return null; // Don't render if no coordinates available
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        padding: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        backgroundColor: colors.textLight,
        borderRadius: BorderRadius.full,
      }}
    >
      <ThemedText>📍</ThemedText>
    </TouchableOpacity>
  );
}
