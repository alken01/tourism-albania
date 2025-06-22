import PlaceCategorySection from "@/components/PlaceCategorySection";
import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { NearbyPlaceGroup } from "@/types/api";
import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";

interface NearbyPlacesSectionProps {
  nearbyPlaces: NearbyPlaceGroup[];
}

export default function NearbyPlacesSection({
  nearbyPlaces,
}: NearbyPlacesSectionProps) {
  const { colors, Spacing, Typography } = useThemedStyles();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const animatedValues = useRef<Map<number, Animated.Value>>(new Map());

  const getAnimatedValue = (categoryId: number) => {
    if (!animatedValues.current.has(categoryId)) {
      animatedValues.current.set(categoryId, new Animated.Value(0));
    }
    return animatedValues.current.get(categoryId)!;
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const animatedValue = getAnimatedValue(categoryId);
    const isCurrentlyExpanded = expandedCategories.has(categoryId);

    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });

    Animated.timing(animatedValue, {
      toValue: isCurrentlyExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return null;
  }

  const styles = {
    nearbySection: {
      backgroundColor: colors.background,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    nearbyTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      color: colors.text,
    },
  };

  return (
    <View style={styles.nearbySection}>
      <ThemedText style={styles.nearbyTitle}>Nearby Recommendations</ThemedText>
      {nearbyPlaces.map((item: NearbyPlaceGroup) => {
        if (!item.places || item.places.length === 0) {
          return null;
        }

        const isExpanded = expandedCategories.has(item.category.id);
        const animatedValue = getAnimatedValue(item.category.id);

        return (
          <PlaceCategorySection
            key={`category-${item.category.id}`}
            categoryData={item}
            isExpanded={isExpanded}
            animatedValue={animatedValue}
            onToggle={() => toggleCategoryExpansion(item.category.id)}
          />
        );
      })}
    </View>
  );
}
