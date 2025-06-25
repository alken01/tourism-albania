import EventsList from "@/components/EventsList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCategories, useDailyAllEvents } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function EventsScreen() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();

  // Use daily cached all events
  const {
    data: groupedEvents,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useDailyAllEvents();

  const { data: categories, refetch: refetchCategories } = useCategories();

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

  // Loading state - only show when no data is available
  if (eventsLoading && !groupedEvents) {
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

  // Error state - only show when no data is available
  if (eventsError && !groupedEvents) {
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
    <EventsList
      groupedEvents={groupedEvents || []}
      categories={categories || []}
      onEventPress={handleEventPress}
      onCategoryPress={handleCategoryPress}
      onRefresh={handleRefresh}
      isLoading={eventsLoading}
    />
  );
}
