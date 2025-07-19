import { Slot, Stack } from "expo-router";

export default function EquipmentsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Equipo",
          headerTitleStyle: {
            color: "#1F2937",
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#3B82F6",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: true,
        }}
      />
      <Slot />
    </>
  );
}
