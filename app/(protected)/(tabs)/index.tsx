// app/(protected)/(tabs)/index.tsx
import Main from "@/components/Main";
import { Link, Stack } from "expo-router";
import { Menu, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function HomeTab() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShown: false,
          headerRight: () => (
            <View className="p-2 mr-4 rounded-full bg-gray-100/50">
              <Link href="/profile" asChild>
                <TouchableOpacity className="p-2 rounded-full bg-gray-100/50">
                  <User size={24} color="#6B7280" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
          headerLeft: () => (
            <View className="p-2 ml-4">
              <Menu size={28} color="#fff" />
            </View>
          ),
          headerStyle: {
            backgroundColor: "#2563eb",
          },
        }}
      />
      <Main />
    </>
  );
}
