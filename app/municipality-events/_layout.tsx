import { Stack } from "expo-router";

export default function MunicipalityEventsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Municipality Events",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
