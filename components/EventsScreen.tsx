import EventsFilter from "@/components/EventsFilter";
import EventsList from "@/components/EventsList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useCategories,
  useEvents,
  useFilteredEvents,
  useMunicipalities,
} from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

export interface GroupedEvents {
  municipality: string;
  events: Event[];
}

export default function EventsScreen() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);

  // Use filtered events if municipality is selected, otherwise use regular events
  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
    loadMore: loadMoreEvents,
    hasNextPage,
  } = useEvents();

  const {
    data: filteredEvents,
    loading: filteredEventsLoading,
    error: filteredEventsError,
    refetch: refetchFilteredEvents,
  } = useFilteredEvents(
    selectedMunicipality
      ? {
          municipality_id: selectedMunicipality,
          audience: 0, // Default audience parameter as shown in the API
        }
      : undefined
  );

  const { data: categories, refetch: refetchCategories } = useCategories();
  const { data: municipalities, refetch: refetchMunicipalities } =
    useMunicipalities();

  // Use filtered events if municipality is selected, otherwise use regular events
  const displayEvents = selectedMunicipality ? filteredEvents : events;
  const isLoading = selectedMunicipality
    ? filteredEventsLoading
    : eventsLoading;
  const error = selectedMunicipality ? filteredEventsError : eventsError;

  const handleEventPress = (event: Event) => {
    // Navigate to event detail page
    router.push(`/event/${event.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category detail - route will be created later
    console.log("Navigate to category:", category.id);
  };

  const handleMunicipalitySelect = (municipalityId: number | null) => {
    setSelectedMunicipality(municipalityId);
  };

  const handleRefresh = async () => {
    if (selectedMunicipality) {
      await Promise.all([
        refetchFilteredEvents(),
        refetchCategories(),
        refetchMunicipalities(),
      ]);
    } else {
      await Promise.all([
        refetchEvents(),
        refetchCategories(),
        refetchMunicipalities(),
      ]);
    }
  };

  const handleLoadMore = () => {
    // Load more only works for regular events (paginated), not filtered events
    if (!selectedMunicipality && hasNextPage && !eventsLoading) {
      loadMoreEvents();
    }
  };

  // Group events by municipality
  const groupedEvents: GroupedEvents[] = React.useMemo(() => {
    if (!displayEvents) return [];

    // If a municipality is selected, don't group since all events are from the same municipality
    if (selectedMunicipality) {
      const municipalityName =
        displayEvents[0]?.municipality?.name || "Selected Municipality";
      return [
        {
          municipality: municipalityName,
          events: displayEvents,
        },
      ];
    }

    const grouped = displayEvents.reduce((acc, event) => {
      const municipalityName = event.municipality.name;

      const existingGroup = acc.find(
        (group) => group.municipality === municipalityName
      );

      if (existingGroup) {
        existingGroup.events.push(event);
      } else {
        acc.push({
          municipality: municipalityName,
          events: [event],
        });
      }

      return acc;
    }, [] as GroupedEvents[]);

    return grouped.sort((a, b) => a.municipality.localeCompare(b.municipality));
  }, [displayEvents, selectedMunicipality]);

  // Loading state - only show when no data is available
  if (isLoading && !displayEvents) {
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
  if (error && !displayEvents) {
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
    <ThemedView style={[{ flex: 1 }, themedStyles.background]}>
      {/* Municipality Filter */}
      <EventsFilter
        municipalities={municipalities || []}
        selectedMunicipality={selectedMunicipality}
        onMunicipalitySelect={handleMunicipalitySelect}
      />

      <EventsList
        groupedEvents={groupedEvents}
        categories={categories || []}
        onEventPress={handleEventPress}
        onCategoryPress={handleCategoryPress}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        hasNextPage={!selectedMunicipality && hasNextPage} // Disable load more for filtered events
      />
    </ThemedView>
  );
}
