import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: t("events"),
          headerStyle: {
            backgroundColor: "transparent",
          },
          tabBarLabel: t("events"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="beaches"
        options={{
          title: t("beaches"),
          headerStyle: Platform.select({
            ios: {
              backgroundColor: "transparent",
            },
            default: {},
          }),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="water.waves" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: t("info"),
          headerStyle: Platform.select({
            ios: {
              backgroundColor: "transparent",
            },
            default: {},
          }),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
