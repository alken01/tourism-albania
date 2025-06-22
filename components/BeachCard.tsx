import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BeachCardProps {
  beach: Beach;
  onPress?: (beach: Beach) => void;
  preferredLanguage?: "en" | "sq";
  showLocation?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Two cards per row with margins

export default function BeachCard({
  beach,
  onPress,
  preferredLanguage = "en",
  showLocation = true,
}: BeachCardProps) {
  const handlePress = () => {
    onPress?.(beach);
  };

  const getBeachName = () => {
    return preferredLanguage === "sq" ? beach.name_sq : beach.name_en;
  };

  const getBeachDescription = () => {
    const description =
      preferredLanguage === "sq" ? beach.description_sq : beach.description_en;
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "publike":
        return "#4CAF50";
      case "kontrate":
        return "#FF9800";
      case "e menaxhuar":
        return "#2196F3";
      default:
        return "#757575";
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        {beach.photo_urls && beach.photo_urls.length > 0 && (
          <Image
            source={{ uri: beach.photo_urls[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(beach.type) },
              ]}
            >
              <Text style={styles.typeText}>{beach.type}</Text>
            </View>

            {beach.is_public && (
              <View style={styles.publicBadge}>
                <Text style={styles.publicText}>PUBLIC</Text>
              </View>
            )}
          </View>

          <ThemedText style={styles.title} numberOfLines={2}>
            {getBeachName()}
          </ThemedText>

          {showLocation && (
            <View style={styles.locationContainer}>
              <ThemedText style={styles.locationText}>
                📍 {beach.municipality.name}
              </ThemedText>
            </View>
          )}

          <ThemedText style={styles.description} numberOfLines={3}>
            {getBeachDescription()}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
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
    height: 120,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  publicBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  publicText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    lineHeight: 18,
  },
  locationContainer: {
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
  },
  description: {
    fontSize: 11,
    color: "#777",
    lineHeight: 15,
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 2,
  },
  detailText: {
    fontSize: 10,
    color: "#888",
  },
});
