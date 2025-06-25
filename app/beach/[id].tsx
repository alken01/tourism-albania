import BeachImageCarousel from "@/components/BeachImageCarousel";
import BeachInfoSection from "@/components/BeachInfoSection";
import NearbyPlacesAccordion from "@/components/NearbyPlacesAccordion";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

// Simple loading component
function BeachDetailSkeleton() {
  const { colors, Spacing, BorderRadius } = useThemedStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageSkeleton: {
      height: 250,
      backgroundColor: colors.backgroundSecondary,
    },
    contentSkeleton: {
      padding: Spacing.lg,
    },
    skeletonBox: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.md,
    },
    skeletonLarge: {
      height: 80,
    },
    skeletonMedium: {
      height: 60,
    },
    skeletonSmall: {
      height: 40,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.skeletonBox, styles.imageSkeleton]} />
        <View style={styles.contentSkeleton}>
          <View style={[styles.skeletonBox, styles.skeletonLarge]} />
          <View style={[styles.skeletonBox, styles.skeletonMedium]} />
          <View style={[styles.skeletonBox, styles.skeletonLarge]} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Error component
function BeachDetailError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  const { colors, Spacing, BorderRadius, Typography } = useThemedStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorCard: {
      backgroundColor: colors.backgroundSecondary,
      margin: Spacing.lg,
      padding: Spacing.xl,
      borderRadius: BorderRadius.lg,
      alignItems: "center",
    },
    errorTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.error,
      marginBottom: Spacing.md,
      textAlign: "center",
    },
    errorMessage: {
      fontSize: Typography.sizes.md,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: Spacing.xl,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.md,
      flexDirection: "row",
      alignItems: "center",
    },
    retryButtonText: {
      color: colors.textLight,
      fontWeight: Typography.weights.semibold,
      marginLeft: Spacing.sm,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.errorCard}>
        <ThemedText style={styles.errorTitle}>
          Oops! Something went wrong
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Beach not found"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={18} color={colors.textLight} />
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

export default function BeachDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beachId = parseInt(id || "0", 10);
  const navigation = useNavigation();

  const { data: beach, loading, error, refetch } = useBeach(beachId);
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing } = useThemedStyles();

  const getBeachName = () => {
    return beach ? getLocalizedField(beach, "name") : "";
  };

  // Update navigation title when beach data is loaded
  useEffect(() => {
    if (beach) {
      navigation.setOptions({
        headerTitle: getBeachName(),
      });
    }
  }, [beach, navigation]);

  if (loading) {
    return <BeachDetailSkeleton />;
  }

  if (error || !beach) {
    return (
      <BeachDetailError error={error || "Beach not found"} onRetry={refetch} />
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingBottom: Spacing.xxl * 2,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <BeachImageCarousel beach={beach} />
        <BeachInfoSection beach={beach} />
        <NearbyPlacesAccordion nearbyPlaces={beach.nearby_places || []} />
      </ScrollView>
    </ThemedView>
  );
}
