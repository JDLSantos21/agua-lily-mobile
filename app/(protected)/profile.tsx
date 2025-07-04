import ScreenLayout from "@/shared/components/ScreenLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import { Stack } from "expo-router";
import { Button, Text, View } from "react-native";
export default function Profile() {
  const { signOut } = useAuth();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Perfil",
          headerTitleAlign: "center",
          headerTintColor: "#3B82F6",
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
      <ScreenLayout>
        <View className="items-center justify-center flex-1 bg-blue-500">
          <Text className="text-lg font-bold">Perfil</Text>
          <Text className="mt-2 text-gray-500">
            Esta es la pantalla de perfil.
          </Text>
        </View>
        <View>
          <Button title="Cerrar sesión" color="red" onPress={() => signOut()} />
        </View>
      </ScreenLayout>
    </>
  );
}
