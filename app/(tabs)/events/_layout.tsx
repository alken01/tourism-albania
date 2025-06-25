import { useLanguage } from "@/hooks/useLanguage";
import { Stack } from "expo-router";
import React from "react";

export default function EventsLayout() {
  const { t } = useLanguage();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          title: t("events"),
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBlurEffect: "regular",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
