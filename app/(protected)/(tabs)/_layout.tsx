// app/(protected)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { TabBar } from "@/shared/components/tabbar/TabBar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", headerShown: false }}
      />
      <Tabs.Screen
        name="equipments"
        options={{
          title: "Equipos",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
