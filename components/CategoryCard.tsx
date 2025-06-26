import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent } from "@/components/ui/card";
import { BorderWidth } from "@/constants/GlobalStyles";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category } from "@/types/api";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = 100;

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { colors, Spacing, BorderRadius, Typography } = useThemedStyles();
  const getLocalizedField = useLocalizedField();

  const getCategoryName = () => {
    const name = getLocalizedField(category, "name");
    return name.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const getCategoryIcon = () => {
    const name = category.name_en.toLowerCase();
    if (name.includes("art")) return "🎨";
    if (name.includes("theater")) return "🎭";
    if (name.includes("concerts")) return "🎤";
    if (name.includes("sport")) return "⚽";
    if (name.includes("local")) return "🎉";
    if (name.includes("agrotourism")) return "🍽️";
    if (name.includes("visual arts")) return "🖼️";
    if (name.includes("folklore")) return "💃";
    if (name.includes("cultural heritage")) return "🏛️";
    if (name.includes("music festival")) return "🎵";
    if (name.includes("conferences")) return "🎯";
    if (name.includes("touristic trips")) return "🗺️";
    return "📅";
  };

  const styles = StyleSheet.create({
    cardContainer: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginRight: Spacing.md,
    },
    cardContent: {
      padding: Spacing.lg,
      height: "100%",
      position: "relative",
      borderWidth: BorderWidth.xs,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
    },
    categoryNameContainer: {
      position: "absolute",
      bottom: Spacing.md,
      left: Spacing.md,
      right: Spacing.md,
    },
    categoryName: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
      lineHeight: Typography.sizes.md * 1.1,
    },
    emojiText: {
      position: "absolute",
      top: Spacing.md,
      right: Spacing.md,
      fontSize: Typography.sizes.massive,
      lineHeight: Typography.sizes.massive / 2,
    },
  });

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress?.(category)}
      activeOpacity={0.9}
    >
      <Card style={{ flex: 1 }}>
        <CardContent style={styles.cardContent}>
          <View style={styles.categoryNameContainer}>
            <ThemedText style={styles.categoryName} numberOfLines={3}>
              {getCategoryName()}
            </ThemedText>
          </View>
          <ThemedText style={styles.emojiText}>
            {"\n"} {/* emoji was getting cut off without this */}
            {getCategoryIcon()}
          </ThemedText>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
