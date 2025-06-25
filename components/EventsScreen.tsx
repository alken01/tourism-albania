import EventsList from "@/components/EventsList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useCategories,
  useFeaturedMunicipalities,
  useSearchMunicipalities,
} from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function EventsScreen() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();
  const [searchTerm, setSearchTerm] = useState("");

  // Use featured municipalities (top 5) when no search term
  const {
    data: featuredMunicipalities,
    loading: featuredLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedMunicipalities();

  // Use search results when there's a search term
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMunicipalities(searchTerm);

  const { data: categories, refetch: refetchCategories } = useCategories();

  // Determine which data to display
  const isSearching = searchTerm.trim().length > 0;
  const displayData = isSearching ? searchResults : featuredMunicipalities;
  const isLoading = isSearching ? searchLoading : featuredLoading;
  const error = isSearching ? searchError : featuredError;

  // Debug logging
  useEffect(() => {
    console.log("EventsScreen Debug:", {
      searchTerm,
      isSearching,
      featuredMunicipalities: featuredMunicipalities?.length,
      searchResults: searchResults?.length,
      displayData: displayData?.length,
      featuredLoading,
      searchLoading,
      featuredError,
      searchError,
    });
  }, [
    searchTerm,
    isSearching,
    featuredMunicipalities,
    searchResults,
    displayData,
    featuredLoading,
    searchLoading,
    featuredError,
    searchError,
  ]);

  const handleEventPress = (event: Event) => {
    // Navigate to event detail page
    router.push(`/event/${event.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category detail - route will be created later
    console.log("Navigate to category:", category.id);
  };

  const handleRefresh = async () => {
    if (isSearching) {
      await Promise.all([refetchSearch(), refetchCategories()]);
    } else {
      await Promise.all([refetchFeatured(), refetchCategories()]);
    }
  };

  const handleSearchChange = (text: string) => {
    console.log("Search term changed:", text);
    setSearchTerm(text);
  };

  // Loading state - only show when no data is available
  if (isLoading && !displayData) {
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
  if (error && !displayData) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          Error loading events: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      {/* Events List with custom search bar that will hide with large title */}
      <EventsList
        groupedEvents={displayData || []}
        categories={categories || []}
        onEventPress={handleEventPress}
        onCategoryPress={handleCategoryPress}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        isFeatured={!isSearching}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </>
  );
}
