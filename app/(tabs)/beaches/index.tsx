import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import BeachesList from "@/components/BeachesList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeaches, useMunicipalities } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface GroupedBeaches {
  municipality: string;
  beaches: Beach[];
}

export default function BeachesScreen() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);

  const {
    data: beaches,
    loading: beachesLoading,
    error: beachesError,
    refetch: refetchBeaches,
  } = useBeaches(
    selectedMunicipality ? { municipality_id: selectedMunicipality } : undefined
  );

  const {
    data: municipalities,
    loading: municipalitiesLoading,
    error: municipalitiesError,
  } = useMunicipalities();

  const handleBeachPress = (beach: Beach) => {
    // Navigation is now handled by BeachCard component
    console.log("Beach selected:", beach.name_en);
  };

  const handleRefresh = async () => {
    await refetchBeaches();
  };

  const handleMunicipalitySelect = (municipalityId: number | null) => {
    setSelectedMunicipality(municipalityId);
  };

  // Group beaches by municipality
  const groupedBeaches: GroupedBeaches[] = React.useMemo(() => {
    if (!beaches || !municipalities) return [];

    const grouped = beaches.reduce((acc, beach) => {
      const municipality = municipalities.find(
        (m) => m.id === beach.municipality.id
      );
      const municipalityName = municipality?.name || "Unknown Location";

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
  }, [beaches, municipalities]);

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
    <BeachesList
      groupedBeaches={groupedBeaches}
      municipalities={municipalities || []}
      selectedMunicipality={selectedMunicipality}
      onMunicipalitySelect={handleMunicipalitySelect}
      onBeachPress={handleBeachPress}
      onRefresh={handleRefresh}
      isLoading={beachesLoading}
      totalBeachesCount={beaches?.length || 0}
    />
  );
}
