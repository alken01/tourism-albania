import React from "react";
import { FlatList, RefreshControl } from "react-native";

import BeachGroup from "@/components/BeachGroup";
import BeachesHeader from "@/components/BeachesHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface Municipality {
  id: number;
  name: string;
  has_beaches?: boolean;
}

interface GroupedBeaches {
  municipality: string;
  beaches: Beach[];
}

interface BeachesListProps {
  groupedBeaches: GroupedBeaches[];
  municipalities: Municipality[];
  selectedMunicipality: number | null;
  onMunicipalitySelect: (municipalityId: number | null) => void;
  onBeachPress: (beach: Beach) => void;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  totalBeachesCount: number;
}

export default function BeachesList({
  groupedBeaches,
  municipalities,
  selectedMunicipality,
  onMunicipalitySelect,
  onBeachPress,
  onRefresh,
  isLoading,
  totalBeachesCount,
}: BeachesListProps) {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const renderBeachGroup = ({ item }: { item: GroupedBeaches }) => (
    <BeachGroup
      municipality={item.municipality}
      beaches={item.beaches}
      onBeachPress={onBeachPress}
    />
  );

  return (
    <ThemedView style={[GlobalStyles.container, themedStyles.background]}>
      <FlatList
        data={groupedBeaches}
        renderItem={renderBeachGroup}
        keyExtractor={(item) => item.municipality}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={() => (
          <BeachesHeader
            municipalities={municipalities}
            selectedMunicipality={selectedMunicipality}
            onMunicipalitySelect={onMunicipalitySelect}
            totalBeachesCount={totalBeachesCount}
          />
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
