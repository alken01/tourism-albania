import React from "react";
import { FlatList, Platform, RefreshControl } from "react-native";

import BeachGroup from "@/components/BeachGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface GroupedBeaches {
  municipality: string;
  beaches: Beach[];
}

interface BeachesListProps {
  groupedBeaches: GroupedBeaches[];
  onBeachPress: (beach: Beach) => void;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

export default function BeachesList({
  groupedBeaches,
  onBeachPress,
  onRefresh,
  isLoading,
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
    <FlatList
      style={[{ flex: 1 }, themedStyles.background]}
      contentInsetAdjustmentBehavior="automatic"
      data={groupedBeaches}
      renderItem={renderBeachGroup}
      keyExtractor={(item) => item.municipality}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={() => (
        <ThemedView style={GlobalStyles.emptyContainer}>
          <ThemedText style={[GlobalStyles.emptyText, themedStyles.textMuted]}>
            No beaches found for the selected municipality
          </ThemedText>
        </ThemedView>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl, // Account for tab bar
      }}
    />
  );
}
