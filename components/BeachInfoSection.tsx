import { ThemedText } from "@/components/ThemedText";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

interface BeachInfoSectionProps {
  beach: Beach;
}

export default function BeachInfoSection({ beach }: BeachInfoSectionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const getBeachDescription = () => {
    return getLocalizedField(beach, "description");
  };

  const handleOpenMap = () => {
    if (beach?.pin_location) {
      Linking.openURL(beach.pin_location);
    }
  };

  const styles = {
    infoSection: {
      padding: Spacing.xl,
      backgroundColor: colors.background,
    },
    mapButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignSelf: "flex-start" as const,
      marginBottom: Spacing.xl,
      ...shadows.md,
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
  };

  return (
    <View style={styles.infoSection}>
      <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
        <ThemedText style={styles.mapButtonText}>🗺️ View on Map</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.description}>
        {getBeachDescription()}
      </ThemedText>
    </View>
  );
}
