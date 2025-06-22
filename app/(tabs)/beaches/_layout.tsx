import { Stack } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function BeachesLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerLargeTitleStyle: {
          fontWeight: "700",
          fontSize: 34,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Albanian Beaches",
          headerTitle: "Albanian Beaches",
        }}
      />
    </Stack>
  );
}
