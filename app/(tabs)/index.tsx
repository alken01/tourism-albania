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

import CategoryCard from "@/components/CategoryCard";
import EventCard from "@/components/EventCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCategories, useEvents } from "@/hooks/useApi";
import { Category, Event } from "@/types/api";

export default function HomeScreen() {
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "sq">("en");

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
    router.push(`/event/${event.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  const handleRefresh = async () => {
    await Promise.all([refetchEvents(), refetchCategories()]);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={handleEventPress}
      preferredLanguage={preferredLanguage}
    />
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      onPress={handleCategoryPress}
      preferredLanguage={preferredLanguage}
    />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !eventsLoading) {
      loadMoreEvents();
    }
  };

  const renderFooter = () => {
    if (!eventsLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading more events...</Text>
      </View>
    );
  };

  if (eventsLoading && !events) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
      </ThemedView>
    );
  }

  if (eventsError && !events) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Error loading events: {eventsError}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={eventsLoading}
            onRefresh={handleRefresh}
            colors={["#FF6B35"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={() => (
          <View>
            <ThemedView style={styles.headerContainer}>
              <ThemedText type="title" style={styles.title}>
                Discover Albania 🇦🇱
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Explore cultural events and beautiful destinations
              </ThemedText>
            </ThemedView>

            {categories && categories.length > 0 && (
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Categories
                </ThemedText>
                <FlatList
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                />
              </ThemedView>
            )}

            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Upcoming Events
              </ThemedText>
            </ThemedView>
          </View>
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
    color: "#FF6B35",
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
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  loadingText: {
    color: "#666",
    marginTop: 8,
  },
});
