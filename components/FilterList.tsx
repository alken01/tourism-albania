import React from "react";
import { FlatList, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface FilterItem {
  id: number;
  name: string;
}

interface FilterListProps {
  title: string;
  items: FilterItem[];
  selectedItemId: number | null;
  onItemSelect: (itemId: number | null) => void;
  allItemsLabel?: string;
}

export default function FilterList({
  title,
  items,
  selectedItemId,
  onItemSelect,
  allItemsLabel = "All",
}: FilterListProps) {
  const { GlobalStyles, themedStyles } = useThemedStyles();

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={GlobalStyles.filterContainer}>
      <ThemedText style={[GlobalStyles.filterTitle, themedStyles.text]}>
        {title}:
      </ThemedText>
      <FlatList
        data={[{ id: 0, name: allItemsLabel }, ...items]}
        renderItem={({ item }) => (
          <Text
            style={[
              GlobalStyles.filterItem,
              selectedItemId === (item.id === 0 ? null : item.id)
                ? themedStyles.filterItemActive
                : themedStyles.filterItem,
            ]}
            onPress={() => onItemSelect(item.id === 0 ? null : item.id)}
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
