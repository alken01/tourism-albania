import { useLanguage } from "@/hooks/useLanguage";
import { Stack } from "expo-router";
import React from "react";

export default function BeachesLayout() {
  const { t } = useLanguage();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
