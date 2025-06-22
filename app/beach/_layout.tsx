import { Stack } from "expo-router";

export default function BeachLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          presentation: "card",
          // headerTitle: "Beach",
          // headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
