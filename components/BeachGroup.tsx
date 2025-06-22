import React from "react";
import { FlatList, View } from "react-native";

import BeachCard from "@/components/BeachCard";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";

interface BeachGroupProps {
  municipality: string;
  beaches: Beach[];
  onBeachPress: (beach: Beach) => void;
}

export default function BeachGroup({
  municipality,
  beaches,
  onBeachPress,
}: BeachGroupProps) {
  const { GlobalStyles } = useThemedStyles();

  return (
    <View style={GlobalStyles.groupContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          justifyContent: "space-between",
        }}
      >
        <ThemedText type="subtitle">{municipality}</ThemedText>
        <ThemedText type="badge">{beaches.length}</ThemedText>
      </View>
      <FlatList
        data={beaches}
        renderItem={({ item: beach }) => (
          <BeachCard
            beach={beach}
            onPress={onBeachPress}
            showLocation={false}
          />
        )}
        keyExtractor={(beach) => beach.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: Spacing.sm,
          paddingRight: Spacing.sm,
        }}
      />
    </View>
  );
}
