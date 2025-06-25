import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

import CategoriesSection from "@/components/CategoriesSection";
import EventGroup from "@/components/EventGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/GlobalStyles";
import { GroupedEvents } from "@/hooks/useApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Category, Event } from "@/types/api";

interface EventsListProps {
  groupedEvents: GroupedEvents[];
  categories: Category[];
  onEventPress: (event: Event) => void;
  onCategoryPress: (category: Category) => void;
  onRefresh: () => Promise<void>;
  onLoadMore?: () => void;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFeatured?: boolean;
  searchTerm?: string;
  onSearchChange: (text: string) => void;
}

export default function EventsList({
  groupedEvents,
  categories,
  onEventPress,
  onCategoryPress,
  onRefresh,
  onLoadMore,
  isLoading,
  hasNextPage = false,
  isFeatured = false,
  searchTerm = "",
  onSearchChange,
}: EventsListProps) {
  const { GlobalStyles, themedStyles, colors, shadows, BorderRadius } =
    useThemedStyles();

  const renderEventGroup = ({ item }: { item: GroupedEvents }) => (
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

  const renderFooter = () => {
    if (!isLoading || !hasNextPage || !onLoadMore) return null;
    return (
      <View
        style={[GlobalStyles.row, GlobalStyles.center, { padding: 20, gap: 8 }]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[GlobalStyles.loadingText, themedStyles.textSecondary]}>
          Loading more events...
        </Text>
      </View>
    );
  };

  const getHeaderText = () => {
    if (searchTerm.trim().length > 0) {
      if (groupedEvents.length === 0) {
        return `No municipalities found for "${searchTerm}"`;
      }
      return `Search Results for "${searchTerm}"`;
    }
    if (isFeatured) {
      return "Featured Municipalities";
    }
    return "Events by Municipality (Ranked by Event Count)";
  };

  const getHeaderSubtitle = () => {
    if (searchTerm.trim().length > 0) {
      return groupedEvents.length > 0
        ? `${groupedEvents.length} municipalities found`
        : null;
    }
    if (isFeatured) {
      return "Top 5 municipalities with the most events";
    }
    return null;
  };

  const searchBarStyles = {
    container: {
      backgroundColor: colors.backgroundSecondary,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.md,
      marginBottom: Spacing.lg,
      borderRadius: 10,
      height: 36,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 8,
    },
    searchIconContainer: {
      width: 28,
      height: 28,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    input: {
      flex: 1,
      fontSize: 17,
      color: colors.text,
      backgroundColor: "transparent",
      paddingVertical: 0,
      paddingHorizontal: 6,
      fontWeight: "400" as const,
    },
    clearButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.textMuted,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: 6,
    },
  };

  return (
    <FlatList
      style={[{ flex: 1 }, themedStyles.background]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustContentInsets={true}
      scrollEventThrottle={1}
      data={groupedEvents}
      renderItem={renderEventGroup}
      keyExtractor={(item) => item.municipality}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (
        <View>
          {renderFooter()}
          {/* Ensure minimum scrollable content for large title behavior */}
          <View style={{ height: 200 }} />
        </View>
      )}
      ListHeaderComponent={() => (
        <View>
          {/* Native-style Search Bar */}
          <View style={searchBarStyles.container}>
            <View style={searchBarStyles.searchIconContainer}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
            </View>
            <TextInput
              style={searchBarStyles.input}
              placeholder="Search"
              placeholderTextColor={colors.textMuted}
              value={searchTerm}
              onChangeText={onSearchChange}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              clearButtonMode="never"
            />
            {searchTerm.length > 0 && (
              <View
                style={searchBarStyles.clearButton}
                onTouchEnd={() => onSearchChange("")}
              >
                <Ionicons name="close" size={12} color={colors.background} />
              </View>
            )}
          </View>

          {/* Show categories only when not searching */}
          {searchTerm.trim().length === 0 && (
            <CategoriesSection
              categories={categories}
              onCategoryPress={onCategoryPress}
            />
          )}

          <ThemedView style={GlobalStyles.sectionContainer}>
            <ThemedText
              type="subtitle"
              style={[GlobalStyles.sectionTitle, themedStyles.text]}
            >
              {getHeaderText()}
            </ThemedText>
            {getHeaderSubtitle() && (
              <ThemedText
                type="default"
                style={[themedStyles.textSecondary, { marginTop: Spacing.xs }]}
              >
                {getHeaderSubtitle()}
              </ThemedText>
            )}
          </ThemedView>
        </View>
      )}
      ListEmptyComponent={() => (
        <ThemedView style={GlobalStyles.emptyContainer}>
          <ThemedText style={[GlobalStyles.emptyText, themedStyles.textMuted]}>
            No events found
          </ThemedText>
        </ThemedView>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        groupedEvents.length === 0
          ? {
              flexGrow: 1,
              paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl,
            }
          : {
              paddingBottom: Platform.OS === "ios" ? Spacing.xxxl : Spacing.xxl,
            }
      }
    />
  );
}
