import React from "react";
import { Linking, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface BeachMapButtonProps {
  beach: Beach;
  size?: "small" | "medium";
  style?: any;
}

export default function BeachMapButton({
  beach,
  size = "small",
  style,
}: BeachMapButtonProps) {
  const { colors, Spacing, BorderRadius, Typography } = useThemedStyles();

  const handlePress = () => {
    if (beach.pin_location) {
      Linking.openURL(beach.pin_location);
    }
  };

  const buttonStyles = {
    container: {
      backgroundColor: colors.primary + "E6", // Semi-transparent
      borderRadius: BorderRadius.sm,
      paddingHorizontal: size === "small" ? Spacing.xs : Spacing.sm,
      paddingVertical: size === "small" ? 4 : Spacing.xs,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
      ...style,
    },
    text: {
      color: colors.textLight,
      fontSize: size === "small" ? Typography.sizes.xs : Typography.sizes.sm,
      fontWeight: Typography.weights.semibold,
      marginLeft: size === "small" ? 2 : 4,
    },
  };

  if (!beach.pin_location) {
    return null; // Don't render if no location available
  }

  return (
    <TouchableOpacity
      style={buttonStyles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ThemedText style={buttonStyles.text}>
        {size === "small" ? "📍" : "🗺️ Map"}
      </ThemedText>
    </TouchableOpacity>
  );
}
