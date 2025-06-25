import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import EventCard from "@/components/EventCard";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Event } from "@/types/api";
import { router } from "expo-router";

interface EventGroupProps {
  municipality: string;
  municipalityId: number;
  events: Event[];
  displayEvents: Event[];
  hasMore: boolean;
  totalEvents: number;
  onEventPress: (event: Event) => void;
}

export default function EventGroup({
  municipality,
  municipalityId,
  events,
  displayEvents,
  hasMore,
  totalEvents,
  onEventPress,
}: EventGroupProps) {
  const {
    GlobalStyles,
    colors,
    shadows,
    Spacing: SpacingStyles,
    BorderRadius,
  } = useThemedStyles();

  const handleSeeMore = () => {
    // Navigate to municipality events page
    router.push(
      `/municipality-events/${municipalityId}?name=${encodeURIComponent(
        municipality
      )}`
    );
  };

  const seeMoreButtonStyles = {
    container: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: colors.primary,
      width: 80,
      height: 80,
      borderRadius: 40,
      marginLeft: SpacingStyles.sm,
      marginRight: SpacingStyles.sm,
      ...shadows.md,
    },
    text: {
      color: colors.textLight,
      fontSize: 12,
      fontWeight: "600" as const,
      textAlign: "center" as const,
    },
    count: {
      color: colors.textLight,
      fontSize: 10,
      marginTop: 2,
    },
  };

  return (
    <View style={GlobalStyles.groupContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          justifyContent: "space-between",
        }}
      >
        <ThemedText type="subtitle">{municipality}</ThemedText>
        <ThemedText type="badge">{totalEvents}</ThemedText>
      </View>
      <FlatList
        data={displayEvents}
        renderItem={({ item: event }) => (
          <EventCard
            event={event}
            onPress={onEventPress}
            showLocation={false}
          />
        )}
        keyExtractor={(event) => event.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: Spacing.sm,
          paddingRight: hasMore ? 0 : Spacing.sm,
        }}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              style={seeMoreButtonStyles.container}
              onPress={handleSeeMore}
              activeOpacity={0.8}
            >
              <ThemedText style={seeMoreButtonStyles.text}>See More</ThemedText>
              <ThemedText style={seeMoreButtonStyles.count}>
                +{events.length - 4}
              </ThemedText>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
