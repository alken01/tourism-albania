import PlaceCard from "@/components/PlaceCard";
import { ThemedText } from "@/components/ThemedText";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { NearbyPlaceGroup, Place } from "@/types/api";
import React from "react";
import { Animated, FlatList, TouchableOpacity, View } from "react-native";

interface PlaceCategorySectionProps {
  categoryData: NearbyPlaceGroup;
  isExpanded: boolean;
  animatedValue: Animated.Value;
  onToggle: () => void;
}

export default function PlaceCategorySection({
  categoryData,
  isExpanded,
  animatedValue,
  onToggle,
}: PlaceCategorySectionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();

  const getCategoryName = () => {
    return getLocalizedField(categoryData.category, "name");
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <PlaceCard
      place={item}
      onPress={(place) => console.log("Place selected:", place.name_en)}
    />
  );

  const animatedHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const rotateZ = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const styles = {
    categorySection: {
      marginBottom: Spacing.md,
      backgroundColor: colors.background,
    },
    categoryHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xs,
    },
    categoryTitle: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
      flex: 1,
    },
    expandIconContainer: {
      width: 24,
      height: 24,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    expandIcon: {
      fontSize: Typography.sizes.sm,
      color: colors.text,
      fontWeight: Typography.weights.bold,
    },
    placesContainer: {
      paddingHorizontal: Spacing.lg,
    },
  };

  return (
    <View style={styles.categorySection}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <ThemedText type="default">
          {getCategoryName()} ({categoryData.places.length})
        </ThemedText>
        <View style={styles.expandIconContainer}>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <ThemedText style={styles.expandIcon}>▶</ThemedText>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          {
            height: animatedHeight,
            opacity: animatedValue,
            overflow: "hidden",
          },
        ]}
      >
        <FlatList
          data={isExpanded ? categoryData.places : []}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderPlaceItem}
          keyExtractor={(place) => `place-${place.id}`}
          contentContainerStyle={styles.placesContainer}
          scrollEnabled={isExpanded}
        />
      </Animated.View>
    </View>
  );
}
