import BeachImageCarousel from "@/components/BeachImageCarousel";
import BeachInfoSection from "@/components/BeachInfoSection";
import NearbyPlacesSection from "@/components/NearbyPlacesSection";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBeach } from "@/hooks/useApi";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";

export default function BeachDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beachId = parseInt(id || "0", 10);
  const navigation = useNavigation();

  const { data: beach, loading, error, refetch } = useBeach(beachId);
  const getLocalizedField = useLocalizedField();
  const { GlobalStyles, themedStyles, colors, Spacing } = useThemedStyles();

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
    return (
      <ThemedView
        style={[GlobalStyles.loadingContainer, themedStyles.background]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[GlobalStyles.loadingText, themedStyles.textSecondary]}
        >
          Loading beach details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !beach) {
    return (
      <ThemedView
        style={[GlobalStyles.errorContainer, themedStyles.background]}
      >
        <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
          {error || "Beach not found"}
        </ThemedText>
        <TouchableOpacity
          style={[GlobalStyles.button, { backgroundColor: colors.primary }]}
          onPress={refetch}
        >
          <ThemedText
            style={[GlobalStyles.buttonText, { color: colors.textLight }]}
          >
            Try Again
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const styles = {
    container: {
      flex: 1,
      ...themedStyles.background,
    },
    scrollContent: {
      paddingBottom: Spacing.xxl * 2,
    },
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BeachImageCarousel beach={beach} />
        <BeachInfoSection beach={beach} />
        <NearbyPlacesSection nearbyPlaces={beach.nearby_places || []} />
      </ScrollView>
    </ThemedView>
  );
}
