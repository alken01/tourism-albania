import { useLanguage } from "@/hooks/useLanguage";
import { Stack } from "expo-router";
import React from "react";

export default function BeachesLayout() {
  const { t } = useLanguage();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
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
