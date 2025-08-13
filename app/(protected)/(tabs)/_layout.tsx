// app/(protected)/(tabs)/_layout.tsx
import { Link, router, Stack, Tabs } from "expo-router";
import { TabBar } from "@/shared/components/tabbar/TabBar";
import { Image, Pressable, TouchableOpacity } from "react-native";
import { User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Link asChild href="/">
              <Pressable
                style={{
                  zIndex: 999,
                  width: 120,
                  height: 35,
                }}
              >
                <Image
                  source={require("../../../assets/logo.png")}
                  style={{
                    width: 120,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="p-2 rounded-full bg-blue-100/50 active:bg-blue-200"
              onPress={() => {
                router.push("/profile");
              }}
            >
              <User size={24} color="#3B82F6" />
            </TouchableOpacity>
          ),
        }}
      />
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
    </>
  );
}
