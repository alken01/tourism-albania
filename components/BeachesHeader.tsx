import React from "react";
import { View } from "react-native";

import BeachesFilter from "@/components/BeachesFilter";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface Municipality {
  id: number;
  name: string;
  has_beaches?: boolean;
}

interface BeachesHeaderProps {
  municipalities: Municipality[];
  selectedMunicipality: number | null;
  onMunicipalitySelect: (municipalityId: number | null) => void;
  totalBeachesCount: number;
}

export default function BeachesHeader({
  municipalities,
  selectedMunicipality,
  onMunicipalitySelect,
  totalBeachesCount,
}: BeachesHeaderProps) {
  const { GlobalStyles, themedStyles } = useThemedStyles();

  const selectedMunicipalityName = selectedMunicipality
    ? municipalities?.find((m) => m.id === selectedMunicipality)?.name
    : null;

  return (
    <View>
      <ThemedView style={GlobalStyles.headerContainer}>
        <ThemedText
          style={[GlobalStyles.headerSubtitle, themedStyles.textSecondary]}
        >
          Discover the most beautiful beaches along Albania&apos;s coast
        </ThemedText>

        <BeachesFilter
          municipalities={municipalities || []}
          selectedMunicipality={selectedMunicipality}
          onMunicipalitySelect={onMunicipalitySelect}
        />
      </ThemedView>

      <ThemedView style={GlobalStyles.sectionContainer}>
        <ThemedText
          type="subtitle"
          style={[GlobalStyles.sectionTitle, themedStyles.text]}
        >
          {selectedMunicipality
            ? `Beaches in ${selectedMunicipalityName}`
            : `All Beaches (${totalBeachesCount})`}
        </ThemedText>
      </ThemedView>
    </View>
  );
}
