import React, { useState } from "react";
import { FlatList, Platform, TextInput, View } from "react-native";

import EventGroup from "@/components/EventGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { GroupedEvents, useSearchMunicipalities } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Event } from "@/types/api";

interface MunicipalitySearchProps {
  onEventPress: (event: Event) => void;
}

export default function MunicipalitySearch({
  onEventPress,
}: MunicipalitySearchProps) {
  const { GlobalStyles, themedStyles, colors, shadows, BorderRadius } =
    useThemedStyles();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useSearchMunicipalities(searchTerm);

  const searchInputStyles = {
    container: {
      backgroundColor: themedStyles.card.backgroundColor,
      margin: Spacing.lg,
      borderRadius: BorderRadius.lg,
      ...shadows.sm,
    },
    input: {
      padding: Spacing.lg,
      fontSize: 16,
      color: colors.text,
      backgroundColor: "transparent",
    },
  };

  const renderMunicipalityGroup = ({ item }: { item: GroupedEvents }) => (
    <EventGroup
      municipality={item.municipality}
      municipalityId={item.municipalityId}
      events={item.events}
      displayEvents={item.displayEvents}
      hasMore={item.hasMore}
      totalEvents={item.totalEvents}
      onEventPress={onEventPress}
    />
  );

  return (
    <ThemedView style={[{ flex: 1 }, themedStyles.background]}>
      {/* Search Input */}
      <View style={searchInputStyles.container}>
        <TextInput
          style={searchInputStyles.input}
          placeholder="Search municipalities..."
          placeholderTextColor={colors.textMuted}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCorrect={false}
          autoCapitalize="words"
        />
      </View>

      {/* Search Results */}
      {searchError ? (
        <ThemedView style={GlobalStyles.errorContainer}>
          <ThemedText style={[GlobalStyles.errorText, themedStyles.errorText]}>
            Error loading municipalities: {searchError}
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={searchResults || []}
          renderItem={renderMunicipalityGroup}
          keyExtractor={(item) => item.municipality}
          ListHeaderComponent={() => (
            <ThemedView style={GlobalStyles.sectionContainer}>
              <ThemedText
                type="subtitle"
                style={[GlobalStyles.sectionTitle, themedStyles.text]}
              >
                {searchTerm.trim()
                  ? `Search Results for "${searchTerm}"`
                  : "All Other Municipalities"}
              </ThemedText>
              {searchResults && (
                <ThemedText
                  type="default"
                  style={[
                    themedStyles.textSecondary,
                    { marginTop: Spacing.xs },
                  ]}
                >
                  {searchResults.length} municipalities found
                </ThemedText>
              )}
            </ThemedView>
          )}
          ListEmptyComponent={() => (
            <ThemedView style={GlobalStyles.emptyContainer}>
              <ThemedText
                style={[GlobalStyles.emptyText, themedStyles.textMuted]}
              >
                {searchTerm.trim()
                  ? `No municipalities found matching "${searchTerm}"`
                  : "No other municipalities available"}
              </ThemedText>
            </ThemedView>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl,
          }}
        />
      )}
    </ThemedView>
  );
}
