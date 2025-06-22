import BeachImageCarousel from "@/components/BeachImageCarousel";
import BeachInfoSection from "@/components/BeachInfoSection";
import NearbyPlacesSection from "@/components/NearbyPlacesSection";
import { ThemedText } from "@/components/ThemedText";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React, { forwardRef, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");

interface BeachDetailSheetProps {
  beachId: number | null;
  isVisible: boolean;
  onClose: () => void;
}

const BeachDetailSheet = forwardRef<View, BeachDetailSheetProps>(
  ({ beachId, isVisible, onClose }, ref) => {
    const { data: beach, loading, error, refetch } = useBeach(beachId || 0);
    const getLocalizedField = useLocalizedField();
    const { GlobalStyles, themedStyles, colors, Spacing, BorderRadius } =
      useThemedStyles();

    const getBeachName = () => {
      return beach ? getLocalizedField(beach, "name") : "";
    };

    const handleBackdropPress = useCallback(() => {
      onClose();
    }, [onClose]);

    const styles = {
      overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      },
      backdrop: {
        flex: 1,
      },
      sheetContainer: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
      },
      header: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.textMuted,
        borderRadius: 2,
        alignSelf: "center" as const,
        marginBottom: Spacing.md,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: "600" as const,
        color: colors.text,
        flex: 1,
        textAlign: "center" as const,
      },
      closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundSecondary,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      closeButtonText: {
        fontSize: 18,
        color: colors.textSecondary,
      },
      content: {
        flex: 1,
      },
      scrollContent: {
        paddingBottom: Spacing.xxl * 2,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: Spacing.xxl,
      },
      errorContainer: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: Spacing.xxl,
      },
      retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.lg,
      },
      retryButtonText: {
        color: colors.textLight,
        fontSize: 16,
        fontWeight: "600" as const,
      },
    };

    if (!isVisible || !beachId) return null;

    const renderContent = () => {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText
              style={{ marginTop: Spacing.md, color: colors.textSecondary }}
            >
              Loading beach details...
            </ThemedText>
          </View>
        );
      }

      if (error || !beach) {
        return (
          <View style={styles.errorContainer}>
            <ThemedText
              style={{
                color: colors.text,
                textAlign: "center",
                marginBottom: Spacing.md,
              }}
            >
              {error || "Beach not found"}
            </ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BeachImageCarousel beach={beach} />
          <BeachInfoSection beach={beach} />
          <NearbyPlacesSection nearbyPlaces={beach.nearby_places || []} />
        </ScrollView>
      );
    };

    return (
      <Animated.View
        style={styles.overlay}
        entering={FadeInDown.duration(300)}
        exiting={FadeOutDown.duration(200)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />

        <Animated.View
          ref={ref}
          style={styles.sheetContainer}
          entering={SlideInDown.duration(400).springify()}
          exiting={SlideOutDown.duration(300)}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <ThemedText style={styles.headerTitle}>
              {beach ? getBeachName() : "Beach Details"}
            </ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeButtonText}>×</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {renderContent()}
        </Animated.View>
      </Animated.View>
    );
  }
);

BeachDetailSheet.displayName = "BeachDetailSheet";

export default BeachDetailSheet;
