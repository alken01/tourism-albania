import React from "react";
import { FlatList, View } from "react-native";

import CategoryCard from "@/components/CategoryCard";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useLanguage } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category } from "@/types/api";

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

export default function CategoriesSection({
  categories,
  onCategoryPress,
}: CategoriesSectionProps) {
  const { GlobalStyles } = useThemedStyles();
  const { t } = useLanguage();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={GlobalStyles.groupContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          marginBottom: Spacing.md,
        }}
      >
        <ThemedText type="subtitle" style={GlobalStyles.sectionTitle}>
          {t("categories")}
        </ThemedText>
      </View>
      <FlatList
        data={categories}
        renderItem={({ item }: { item: Category }) => (
          <CategoryCard category={item} onPress={onCategoryPress} />
        )}
        keyExtractor={(category) => category.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
        }}
      />
    </View>
  );
}
