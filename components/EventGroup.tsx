import React from "react";
import { FlatList, View } from "react-native";

import EventCard from "@/components/EventCard";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Event } from "@/types/api";

interface EventGroupProps {
  municipality: string;
  events: Event[];
  onEventPress: (event: Event) => void;
}

export default function EventGroup({
  municipality,
  events,
  onEventPress,
}: EventGroupProps) {
  const { GlobalStyles } = useThemedStyles();

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
        <ThemedText type="badge">{events.length}</ThemedText>
      </View>
      <FlatList
        data={events}
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
          paddingRight: Spacing.sm,
        }}
      />
    </View>
  );
}
