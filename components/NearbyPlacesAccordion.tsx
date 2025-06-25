import PlaceCard from "@/components/PlaceCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  EnhancedAccordion,
  EnhancedAccordionItem,
} from "@/components/ui/enhanced-accordion";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { NearbyPlaceGroup, Place } from "@/types/api";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface NearbyPlacesAccordionProps {
  nearbyPlaces: NearbyPlaceGroup[];
}

export default function NearbyPlacesAccordion({
  nearbyPlaces,
}: NearbyPlacesAccordionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography, BorderRadius, shadows } =
    useThemedStyles();

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <PlaceCard
      place={item}
      onPress={(place) => console.log("Place selected:", place.name_en)}
    />
  );

  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: BorderRadius.lg,
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      ...shadows.md,
    },
    header: {
      padding: Spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
    },
    triggerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
    },
    categoryName: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
      flex: 1,
    },
    placeCount: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      backgroundColor: colors.backgroundTertiary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      marginLeft: Spacing.sm,
      marginRight: Spacing.sm,
      minWidth: 32,
      textAlign: "center",
    },
    placesContainer: {
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    placesSeparator: {
      width: Spacing.md,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Nearby Recommendations</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover interesting places around this beach
        </ThemedText>
      </View>

      <View style={styles.content}>
        <EnhancedAccordion>
          {nearbyPlaces.map((item: NearbyPlaceGroup, index) => {
            if (!item.places || item.places.length === 0) {
              return null;
            }

            const categoryName = getLocalizedField(item.category, "name");
            const isLast = index === nearbyPlaces.length - 1;

            const titleContent = (
              <View style={styles.triggerContent}>
                <ThemedText style={styles.categoryName}>
                  {categoryName}
                </ThemedText>
                <ThemedText style={styles.placeCount}>
                  {item.places.length}
                </ThemedText>
              </View>
            );

            return (
              <EnhancedAccordionItem
                key={`category-${item.category.id}`}
                title={titleContent}
                isLastItem={isLast}
                style={{
                  borderBottomColor: colors.border,
                }}
              >
                <View style={styles.placesContainer}>
                  <FlatList
                    data={item.places}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderPlaceItem}
                    keyExtractor={(place) => `place-${place.id}`}
                    contentContainerStyle={{
                      paddingHorizontal: 0,
                      paddingVertical: Spacing.sm,
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.placesSeparator} />
                    )}
                  />
                </View>
              </EnhancedAccordionItem>
            );
          })}
        </EnhancedAccordion>
      </View>
    </ThemedView>
  );
}
