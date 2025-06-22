import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Category } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
  preferredLanguage?: "en" | "sq";
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Two cards per row with margins

export default function CategoryCard({
  category,
  onPress,
  preferredLanguage = "en",
}: CategoryCardProps) {
  const handlePress = () => {
    onPress?.(category);
  };

  const getCategoryName = () => {
    return preferredLanguage === "sq" ? category.name_sq : category.name_en;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        {category.photo && (
          <Image
            source={{ uri: category.photo }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.overlay}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {getCategoryName()}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 120,
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
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 20,
  },
});
