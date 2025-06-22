import { ThemedText } from "@/components/ThemedText";
import { BlurRadius, Spacing } from "@/constants/GlobalStyles";
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
const CARD_WIDTH = (width - Spacing.lg) / 3;
const CARD_HEIGHT = CARD_WIDTH / 3;

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { colors, Spacing, BorderRadius } = useThemedStyles();
  const getLocalizedField = useLocalizedField();

  const getCategoryName = () => {
    return getLocalizedField(category, "name");
  };

  const cardStyles = {
    container: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginHorizontal: Spacing.sm,
      borderRadius: BorderRadius.xl,
      overflow: "hidden" as const,
      position: "relative" as const,
      backgroundColor: colors.background,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    image: {
      position: "absolute" as const,
      width: "100%" as const,
      height: "100%" as const,
    },
    blackOverlay: {
      position: "absolute" as const,
      width: "100%" as const,
      height: "100%" as const,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    textContainer: {
      zIndex: 1,
      position: "relative" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
  };

  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={() => onPress?.(category)}
    >
      <Image
        source={{ uri: category.photo }}
        style={cardStyles.image}
        contentFit="cover"
        blurRadius={BlurRadius.sm}
      />
      <View style={cardStyles.blackOverlay} />
      <View style={cardStyles.textContainer}>
        <ThemedText
          type="badgeNoBg"
          style={{ color: colors.textLight, textAlign: "center" }}
        >
          {getCategoryName()}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
