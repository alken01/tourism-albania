import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";

import CategoryCard from "@/components/CategoryCard";
import EventCard from "@/components/EventCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";

interface EventsListProps {
  events: Event[];
  categories: Category[];
  onEventPress: (event: Event) => void;
  onCategoryPress: (category: Category) => void;
  onRefresh: () => Promise<void>;
  onLoadMore: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
}

export default function EventsList({
  events,
  categories,
  onEventPress,
  onCategoryPress,
  onRefresh,
  onLoadMore,
  isLoading,
  hasNextPage,
}: EventsListProps) {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={onEventPress} />
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryCard category={item} onPress={onCategoryPress} />
  );

  const renderFooter = () => {
    if (!isLoading || !hasNextPage) return null;
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
      data={events}
      renderItem={renderEventItem}
      keyExtractor={(item) => item.id.toString()}
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
          {categories && categories.length > 0 && (
            <ThemedView style={GlobalStyles.sectionContainer}>
              <ThemedText
                type="subtitle"
                style={[GlobalStyles.sectionTitle, themedStyles.text]}
              >
                Categories
              </ThemedText>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </ThemedView>
          )}

          <ThemedView style={GlobalStyles.sectionContainer}>
            <ThemedText
              type="subtitle"
              style={[GlobalStyles.sectionTitle, themedStyles.text]}
            >
              Upcoming Events
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
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl, // Account for tab bar
      }}
    />
  );
}
