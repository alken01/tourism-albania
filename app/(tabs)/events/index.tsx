import { router } from "expo-router";
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
import { useCategories, useEvents } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";

export default function HomeScreen() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
    loadMore: loadMoreEvents,
    hasNextPage,
  } = useEvents();

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const handleEventPress = (event: Event) => {
    // Navigate to event detail page
    router.push(`/event/${event.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category detail - route will be created later
    console.log("Navigate to category:", category.id);
  };

  const handleRefresh = async () => {
    await Promise.all([refetchEvents(), refetchCategories()]);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={handleEventPress} />
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryCard category={item} onPress={handleCategoryPress} />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !eventsLoading) {
      loadMoreEvents();
    }
  };

  const renderFooter = () => {
    if (!eventsLoading) return null;
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

  if (eventsLoading && !events) {
    return (
      <ThemedView
        style={[GlobalStyles.loadingContainer, themedStyles.background]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[GlobalStyles.loadingText, themedStyles.textSecondary]}
        >
          Loading events...
        </ThemedText>
      </ThemedView>
    );
  }

  if (eventsError && !events) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          Error loading events: {eventsError}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      style={[{ flex: 1 }, themedStyles.background]}
      contentInsetAdjustmentBehavior="automatic"
      data={events}
      renderItem={renderEventItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={eventsLoading}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={handleLoadMore}
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
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "ios" ? 90 : 60, // Account for tab bar
      }}
    />
  );
}
