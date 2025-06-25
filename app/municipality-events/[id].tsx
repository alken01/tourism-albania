import EventCard from "@/components/EventCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { useDailyAllEvents } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Event } from "@/types/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Platform } from "react-native";

export default function MunicipalityEventsPage() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const {
    data: groupedEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useDailyAllEvents();

  const municipalityEvents = useMemo(() => {
    if (!groupedEvents || !id) return [];

    const municipalityId = parseInt(id);
    const municipalityGroup = groupedEvents.find(
      (group) => group.municipalityId === municipalityId
    );

    return municipalityGroup?.events || [];
  }, [groupedEvents, id]);

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={handleEventPress}
      showLocation={false} // Hide location since all events are from the same municipality
    />
  );

  // Loading state
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

  // Error state
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
    <ThemedView style={[{ flex: 1 }, themedStyles.background]}>
      <FlatList
        data={municipalityEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        ListHeaderComponent={() => (
          <ThemedView style={GlobalStyles.sectionContainer}>
            <ThemedText
              type="title"
              style={[GlobalStyles.sectionTitle, themedStyles.text]}
            >
              Events in {decodeURIComponent(name || "Municipality")}
            </ThemedText>
            <ThemedText
              type="default"
              style={[themedStyles.textSecondary, { marginTop: Spacing.sm }]}
            >
              {municipalityEvents.length} events found
            </ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={() => (
          <ThemedView style={GlobalStyles.emptyContainer}>
            <ThemedText
              style={[GlobalStyles.emptyText, themedStyles.textMuted]}
            >
              No events found in this municipality
            </ThemedText>
          </ThemedView>
        )}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
