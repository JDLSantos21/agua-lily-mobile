// app/(auth)/login.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  //   Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useAlert } from "@/shared/components/ui/Alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const alert = useAlert();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => signIn(username, password),
    onError: (e: any) =>
      alert.error(
        "No se pudo iniciar sesión",
        e.response?.data?.error || "Ocurrió un error al iniciar sesión",
      ),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="justify-center flex-1 px-8 py-8">
          {/* Logo Section */}
          <View className="items-center mb-12">
            <View className="items-center justify-center w-24 h-24 mb-6 bg-white rounded-full shadow-md">
              <Image
                source={require("../../assets/images/icon.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-800">
              Agua Lily
            </Text>
            <Text className="text-base text-center text-gray-600">
              Gestión de Pedidos para Conductores
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">
                Correo Electrónico
              </Text>
              <TextInput
                placeholder="ejemplo@correo.com"
                className="px-4 py-4 text-base text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">
                Contraseña
              </Text>
              <TextInput
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                className="px-4 py-4 text-base text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              className={`py-4 rounded-2xl mt-6 shadow-md ${
                isPending ? "bg-gray-400" : "bg-blue-600 active:bg-blue-700"
              }`}
              onPress={() => mutate()}
              disabled={isPending}
            >
              <Text className="text-base font-semibold text-center text-white">
                {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center mt-12">
            <Text className="text-sm text-gray-500">
              ¿Problemas para acceder?
            </Text>
            <TouchableOpacity className="mt-2">
              <Text className="text-sm font-medium text-blue-600">
                Contactar soporte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
