import { Stack } from "expo-router";

export default function BeachLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          headerTitle: "",
          headerBackTitle: "",
        }}
      />
    </Stack>
  );
}
