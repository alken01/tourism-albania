import BeachesMap from "@/components/BeachesMap";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeaches } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function MapIndex() {
  const params = useLocalSearchParams();
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const {
    data: beaches,
    loading: beachesLoading,
    error: beachesError,
  } = useBeaches();

  const handleBeachPress = (beach: Beach) => {
    // Navigation is now handled by BeachCard component
    console.log("Beach selected:", beach.name_en);
  };

  // Loading state - only show when no data is available
  if (beachesLoading && !beaches) {
    return (
      <ThemedView
        style={[GlobalStyles.loadingContainer, themedStyles.background]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[GlobalStyles.loadingText, themedStyles.textSecondary]}
        >
          Loading beaches...
        </ThemedText>
      </ThemedView>
    );
  }

  // Error state - only show when no data is available
  if (beachesError && !beaches) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          Error loading beaches: {beachesError}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, ...themedStyles.background }}>
      <BeachesMap
        beaches={beaches || []}
        onBeachPress={handleBeachPress}
        focusBeachId={params.focusBeachId as string}
        focusLatitude={params.latitude as string}
        focusLongitude={params.longitude as string}
      />
    </ThemedView>
  );
}
