import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Two cards per row with margins

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { themedStyles, colors, shadows, Spacing, Typography, BorderRadius } =
    useThemedStyles();

  const getLocalizedField = useLocalizedField();

  const handlePress = () => {
    onPress?.(category);
  };

  const getCategoryName = () => {
    return getLocalizedField(category, "name");
  };

  const cardStyles = {
    container: {
      width: CARD_WIDTH,
      height: 120,
      marginHorizontal: Spacing.sm,
      marginVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      overflow: "hidden" as const,
      position: "relative" as const,
      ...shadows.md,
      ...themedStyles.card,
    },
    image: {
      width: "100%" as const,
      height: "100%" as const,
    },
    overlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.overlay,
      padding: Spacing.md,
      justifyContent: "center" as const,
    },
    title: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.bold,
      color: colors.textLight,
      textAlign: "center" as const,
      lineHeight: Typography.sizes.md * Typography.lineHeights.normal,
    },
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={cardStyles.container}>
        {category.photo && (
          <Image
            source={{ uri: category.photo }}
            style={cardStyles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={cardStyles.overlay}>
          <ThemedText style={cardStyles.title} numberOfLines={2}>
            {getCategoryName()}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
