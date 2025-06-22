import React from "react";
import { FlatList, View } from "react-native";

import BeachCard from "@/components/BeachCard";
import { ThemedText } from "@/components/ThemedText";
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
  const { GlobalStyles, themedStyles } = useThemedStyles();

  return (
    <View style={GlobalStyles.groupContainer}>
      <ThemedText
        type="subtitle"
        style={[GlobalStyles.groupTitle, themedStyles.text]}
      >
        {municipality} ({beaches.length})
      </ThemedText>
      <FlatList
        data={beaches}
        renderItem={({ item: beach }) => (
          <BeachCard beach={beach} onPress={onBeachPress} />
        )}
        keyExtractor={(beach) => beach.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
