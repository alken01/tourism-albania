import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import BeachCard from "@/components/BeachCard";
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
    // Navigate to beach detail - route will be created later
    console.log("Navigate to beach:", beach.id);
  };

  const handleRefresh = async () => {
    await refetchBeaches();
  };

  const renderBeachItem = ({ item }: { item: Beach }) => (
    <BeachCard beach={item} onPress={handleBeachPress} />
  );

  const renderBeachGroup = ({ item }: { item: GroupedBeaches }) => (
    <View style={GlobalStyles.groupContainer}>
      <ThemedText
        type="subtitle"
        style={[GlobalStyles.groupTitle, themedStyles.text]}
      >
        {item.municipality} ({item.beaches.length})
      </ThemedText>
      <View style={GlobalStyles.grid}>
        {item.beaches.map((beach) => (
          <View key={beach.id} style={GlobalStyles.gridItem}>
            <BeachCard beach={beach} onPress={handleBeachPress} />
          </View>
        ))}
      </View>
    </View>
  );

  const beachesWithMunicipalities =
    municipalities?.filter((m) => m.has_beaches) || [];

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
    <ThemedView style={[GlobalStyles.container, themedStyles.background]}>
      <FlatList
        data={groupedBeaches}
        renderItem={renderBeachGroup}
        keyExtractor={(item) => item.municipality}
        refreshControl={
          <RefreshControl
            refreshing={beachesLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={() => (
          <View>
            <ThemedView style={GlobalStyles.headerContainer}>
              <ThemedText
                type="title"
                style={[GlobalStyles.headerTitle, themedStyles.text]}
              >
                Albanian Beaches 🏖️
              </ThemedText>
              <ThemedText
                style={[
                  GlobalStyles.headerSubtitle,
                  themedStyles.textSecondary,
                ]}
              >
                Discover the most beautiful beaches along Albania&apos;s coast
              </ThemedText>

              {beachesWithMunicipalities.length > 0 && (
                <View style={GlobalStyles.filterContainer}>
                  <ThemedText
                    style={[GlobalStyles.filterTitle, themedStyles.text]}
                  >
                    Filter by Municipality:
                  </ThemedText>
                  <FlatList
                    data={[
                      { id: 0, name: "All Beaches" },
                      ...beachesWithMunicipalities,
                    ]}
                    renderItem={({ item }) => (
                      <Text
                        style={[
                          GlobalStyles.filterItem,
                          selectedMunicipality ===
                          (item.id === 0 ? null : item.id)
                            ? themedStyles.filterItemActive
                            : themedStyles.filterItem,
                        ]}
                        onPress={() =>
                          setSelectedMunicipality(
                            item.id === 0 ? null : item.id
                          )
                        }
                      >
                        {item.name}
                      </Text>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={GlobalStyles.filterList}
                  />
                </View>
              )}
            </ThemedView>

            <ThemedView style={GlobalStyles.sectionContainer}>
              <ThemedText
                type="subtitle"
                style={[GlobalStyles.sectionTitle, themedStyles.text]}
              >
                {selectedMunicipality
                  ? `Beaches in ${
                      municipalities?.find((m) => m.id === selectedMunicipality)
                        ?.name
                    }`
                  : `All Beaches (${beaches?.length || 0})`}
              </ThemedText>
            </ThemedView>
          </View>
        )}
        ListEmptyComponent={() => (
          <ThemedView style={GlobalStyles.emptyContainer}>
            <ThemedText
              style={[GlobalStyles.emptyText, themedStyles.textMuted]}
            >
              No beaches found for the selected municipality
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
