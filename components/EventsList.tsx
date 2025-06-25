import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";

import CategoriesSection from "@/components/CategoriesSection";
import EventGroup from "@/components/EventGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { GroupedEvents } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";

interface EventsListProps {
  groupedEvents: GroupedEvents[];
  categories: Category[];
  onEventPress: (event: Event) => void;
  onCategoryPress: (category: Category) => void;
  onRefresh: () => Promise<void>;
  onLoadMore?: () => void;
  isLoading: boolean;
  hasNextPage?: boolean;
}

export default function EventsList({
  groupedEvents,
  categories,
  onEventPress,
  onCategoryPress,
  onRefresh,
  onLoadMore,
  isLoading,
  hasNextPage = false,
}: EventsListProps) {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const renderEventGroup = ({ item }: { item: GroupedEvents }) => (
    <EventGroup
      municipality={item.municipality}
      municipalityId={item.municipalityId}
      events={item.events}
      displayEvents={item.displayEvents}
      hasMore={item.hasMore}
      totalEvents={item.totalEvents}
      onEventPress={onEventPress}
    />
  );

  const renderFooter = () => {
    if (!isLoading || !hasNextPage || !onLoadMore) return null;
    return (
      <View
        style={[GlobalStyles.row, GlobalStyles.center, { padding: 20, gap: 8 }]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[GlobalStyles.loadingText, themedStyles.textSecondary]}>
          Loading more events...
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      style={[{ flex: 1 }, themedStyles.background]}
      contentInsetAdjustmentBehavior="automatic"
      data={groupedEvents}
      renderItem={renderEventGroup}
      keyExtractor={(item) => item.municipality}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={() => (
        <View>
          <CategoriesSection
            categories={categories}
            onCategoryPress={onCategoryPress}
          />

          <ThemedView style={GlobalStyles.sectionContainer}>
            <ThemedText
              type="subtitle"
              style={[GlobalStyles.sectionTitle, themedStyles.text]}
            >
              Events by Municipality (Ranked by Event Count)
            </ThemedText>
          </ThemedView>
        </View>
      )}
      ListEmptyComponent={() => (
        <ThemedView style={GlobalStyles.emptyContainer}>
          <ThemedText style={[GlobalStyles.emptyText, themedStyles.textMuted]}>
            No events found
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
