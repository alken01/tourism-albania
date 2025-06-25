import BeachImageCarousel from "@/components/BeachImageCarousel";
import BeachInfoSection from "@/components/BeachInfoSection";
import NearbyPlacesAccordion from "@/components/NearbyPlacesAccordion";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { RefreshCw, X } from "lucide-react-native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Simple loading component
function BeachDetailSkeleton() {
  const { colors, Spacing, BorderRadius } = useThemedStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageSkeleton: {
      height: 280,
      backgroundColor: colors.backgroundSecondary,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      borderRadius: BorderRadius.lg,
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
        <View style={styles.imageSkeleton} />
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

export default function BeachDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beachId = parseInt(id || "0", 10);

  const { data: beach, loading, error, refetch } = useBeach(beachId);
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, BorderRadius } = useThemedStyles();

  const getBeachName = () => {
    return beach ? getLocalizedField(beach, "name") : "";
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <BeachDetailSkeleton />
      </SafeAreaView>
    );
  }

  if (error || !beach) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <BeachDetailError
          error={error || "Beach not found"}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      backgroundColor: colors.background,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.sm,
    },
    handleBar: {
      width: 40,
      height: 4,
      backgroundColor: colors.textSecondary,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: Spacing.md,
      opacity: 0.3,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    titleContainer: {
      flex: 1,
      marginRight: Spacing.md,
    },
    closeButton: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: BorderRadius.full,
      padding: Spacing.sm,
    },
    contentContainer: {
      paddingBottom: Spacing.xxl * 2,
    },
    sectionSpacer: {
      height: Spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalHeader}>
        <View style={styles.handleBar} />
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" numberOfLines={1}>
              {getBeachName()}
            </ThemedText>
            <ThemedText type="default" style={{ color: colors.textSecondary }}>
              {beach.municipality.name}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <BeachImageCarousel beach={beach} />
        <View style={styles.sectionSpacer} />
        <BeachInfoSection beach={beach} />
        <View style={styles.sectionSpacer} />
        <NearbyPlacesAccordion nearbyPlaces={beach.nearby_places || []} />
      </ScrollView>
    </SafeAreaView>
  );
}
