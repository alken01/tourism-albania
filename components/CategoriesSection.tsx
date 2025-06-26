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

  // Group categories into pairs for 2-row grid
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    groupedCategories.push({
      id: `group-${i}`,
      top: categories[i],
      bottom: categories[i + 1] || null,
    });
  }

  const renderCategoryGroup = ({ item }: { item: any }) => (
    <View style={{ marginRight: Spacing.md }}>
      <CategoryCard category={item.top} onPress={onCategoryPress} />
      {item.bottom && (
        <View style={{ marginTop: Spacing.md }}>
          <CategoryCard category={item.bottom} onPress={onCategoryPress} />
        </View>
      )}
    </View>
  );

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
        data={groupedCategories}
        renderItem={renderCategoryGroup}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: Spacing.lg,
        }}
      />
    </View>
  );
}
