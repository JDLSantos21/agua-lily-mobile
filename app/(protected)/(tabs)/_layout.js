// app/(protected)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HomeIcon, SettingsIcon } from "@/shared/components/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", tabBarIcon: HomeIcon }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Configuración", tabBarIcon: SettingsIcon }}
      />
    </Tabs>
  );
}
