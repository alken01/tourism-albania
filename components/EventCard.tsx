import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Event } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
  preferredLanguage?: "en" | "sq";
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32; // Account for horizontal margins

export default function EventCard({
  event,
  onPress,
  preferredLanguage = "en",
}: EventCardProps) {
  const handlePress = () => {
    onPress?.(event);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventName = () => {
    return preferredLanguage === "sq" && event.event_name_sq
      ? event.event_name_sq.replace(/"/g, "") // Remove quotes from name
      : event.event_name_en.replace(/"/g, "");
  };

  const getCategoryName = () => {
    return preferredLanguage === "sq"
      ? event.category.name_sq
      : event.category.name_en;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        {event.photo_urls && event.photo_urls.length > 0 && (
          <Image
            source={{ uri: event.photo_urls[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryName()}</Text>
          </View>

          <ThemedText style={styles.title} numberOfLines={2}>
            {getEventName()}
          </ThemedText>

          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateText}>
              {formatDate(event.from_date)}
              {event.from_date !== event.to_date &&
                ` - ${formatDate(event.to_date)}`}
            </ThemedText>

            {event.event_hours && event.event_hours !== "N/A" && (
              <ThemedText style={styles.timeText}>
                🕒 {event.event_hours}
              </ThemedText>
            )}
          </View>

          <View style={styles.locationContainer}>
            <ThemedText style={styles.locationText}>
              📍 {event.municipality.name}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  locationContainer: {
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
});
