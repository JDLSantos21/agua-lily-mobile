import ScreenLayout from "@/shared/components/ScreenLayout";
import { Stack } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function Settings() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerTitleAlign: "center",
          headerTintColor: "#3B82F6",
          headerLeft: () => null, // No logo in settings screen
          headerRight: () => null, // No settings icon in settings screen
        }}
      />

      <ScreenLayout>
        <ScrollView>
          <Text className="mb-8 text-2xl font-bold text-blue-500">
            Settings
          </Text>

          <Text className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          <Text className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          <Text className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}
