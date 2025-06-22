import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BeachCard from "@/components/BeachCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeaches, useMunicipalities } from "@/hooks/useApi";
import { Beach } from "@/types/api";

export default function ExploreScreen() {
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "sq">("en");
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
    router.push(`/beach/${beach.id}`);
  };

  const handleRefresh = async () => {
    await refetchBeaches();
  };

  const renderBeachItem = ({ item }: { item: Beach }) => (
    <BeachCard
      beach={item}
      onPress={handleBeachPress}
      preferredLanguage={preferredLanguage}
    />
  );

  const beachesWithMunicipalities =
    municipalities?.filter((m) => m.has_beaches) || [];

  if (beachesLoading && !beaches) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={styles.loadingText}>Loading beaches...</ThemedText>
      </ThemedView>
    );
  }

  if (beachesError && !beaches) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Error loading beaches: {beachesError}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={beaches}
        renderItem={renderBeachItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={beachesLoading}
            onRefresh={handleRefresh}
            colors={["#4CAF50"]}
          />
        }
        ListHeaderComponent={() => (
          <View>
            <ThemedView style={styles.headerContainer}>
              <ThemedText type="title" style={styles.title}>
                Albanian Beaches 🏖️
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Discover the most beautiful beaches along Albania's coast
              </ThemedText>

              {beachesWithMunicipalities.length > 0 && (
                <View style={styles.filterContainer}>
                  <ThemedText style={styles.filterTitle}>
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
                          styles.filterItem,
                          selectedMunicipality ===
                            (item.id === 0 ? null : item.id) &&
                            styles.filterItemActive,
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
                    contentContainerStyle={styles.filterList}
                  />
                </View>
              )}
            </ThemedView>

            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
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
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No beaches found for the selected municipality
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#F44336",
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 16,
  },
  filterContainer: {
    width: "100%",
    marginTop: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 4,
  },
  filterItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    fontSize: 14,
    textAlign: "center",
  },
  filterItemActive: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-around",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: 16,
  },
  loadingText: {
    color: "#666",
    marginTop: 8,
  },
});
