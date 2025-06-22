import React from "react";
import { FlatList, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface Municipality {
  id: number;
  name: string;
  has_beaches?: boolean;
}

interface BeachesFilterProps {
  municipalities: Municipality[];
  selectedMunicipality: number | null;
  onMunicipalitySelect: (municipalityId: number | null) => void;
}

export default function BeachesFilter({
  municipalities,
  selectedMunicipality,
  onMunicipalitySelect,
}: BeachesFilterProps) {
  const { GlobalStyles, themedStyles } = useThemedStyles();

  const beachesWithMunicipalities =
    municipalities?.filter((m) => m.has_beaches) || [];

  if (beachesWithMunicipalities.length === 0) {
    return null;
  }

  return (
    <View style={GlobalStyles.filterContainer}>
      <ThemedText style={[GlobalStyles.filterTitle, themedStyles.text]}>
        Filter by Municipality:
      </ThemedText>
      <FlatList
        data={[{ id: 0, name: "All Beaches" }, ...beachesWithMunicipalities]}
        renderItem={({ item }) => (
          <Text
            style={[
              GlobalStyles.filterItem,
              selectedMunicipality === (item.id === 0 ? null : item.id)
                ? themedStyles.filterItemActive
                : themedStyles.filterItem,
            ]}
            onPress={() => onMunicipalitySelect(item.id === 0 ? null : item.id)}
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
  );
}
