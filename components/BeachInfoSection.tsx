import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BeachInfoSectionProps {
  beach: Beach;
}

export default function BeachInfoSection({ beach }: BeachInfoSectionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography } = useThemedStyles();

  const getBeachDescription = () => {
    return getLocalizedField(beach, "description");
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
    },
    cardHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    cardTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
    },
    description: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Beach Information Card */}
      <Card>
        <CardHeader>
          <ThemedText style={styles.cardTitle}>About This Beach</ThemedText>
        </CardHeader>
        <CardContent>
          <ThemedText style={styles.description}>
            {getBeachDescription()}
          </ThemedText>
        </CardContent>
      </Card>
    </View>
  );
}
