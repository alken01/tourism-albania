import BeachesList from "@/components/BeachesList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeaches } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import React from "react";
import { ActivityIndicator } from "react-native";

export interface GroupedBeaches {
  municipality: string;
  beaches: Beach[];
}

export default function BeachesIndex() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const {
    data: beaches,
    loading: beachesLoading,
    error: beachesError,
    refetch: refetchBeaches,
  } = useBeaches();

  const handleBeachPress = (beach: Beach) => {
    // Navigation is now handled by BeachCard component
    console.log("Beach selected:", beach.name_en);
  };

  const handleRefresh = async () => {
    await refetchBeaches();
  };

  // Group beaches by municipality
  const groupedBeaches: GroupedBeaches[] = React.useMemo(() => {
    if (!beaches) return [];

    const grouped = beaches.reduce((acc, beach) => {
      const municipalityName = beach.municipality.name;

      const existingGroup = acc.find(
        (group) => group.municipality === municipalityName
      );

      if (existingGroup) {
        existingGroup.beaches.push(beach);
      } else {
        acc.push({
          municipality: municipalityName,
          beaches: [beach],
        });
      }

      return acc;
    }, [] as GroupedBeaches[]);

    return grouped.sort((a, b) => a.municipality.localeCompare(b.municipality));
  }, [beaches]);

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
      <BeachesList
        groupedBeaches={groupedBeaches}
        onBeachPress={handleBeachPress}
        onRefresh={handleRefresh}
        isLoading={beachesLoading}
      />
    </ThemedView>
  );
}
