// app/(auth)/login.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { useSession } from "@/context/AuthContext";
import { useAlert } from "@/shared/components/ui/Alert";
import { handleApiError } from "@/shared/utils/errorHandler";
import { useGradualAnimation } from "@/shared/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Loading from "@/shared/components/Loading";

export default function Login() {
  const { height } = useGradualAnimation();
  const { signIn, isSigningIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userInputRef = useRef<TextInput>(null);
  const alert = useAlert();
  const handleSignIn = async () => {
    if (!username || !password) {
      alert.error("Campos requeridos", "Por favor, completa todos los campos.");
      return;
    }

    try {
      await signIn(username, password);
    } catch (error) {
      const errorResult = handleApiError(error, {
        fallbackTitle: "Error de inicio de sesión",
        fallbackMessage:
          "No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente.",
      });

      alert.error(errorResult.title, errorResult.message);
    }
  };

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value - 150,
    };
  }, []);

  return (
    <ScreenLayout>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="justify-center flex-1 px-8 py-8">
          {/* Logo Section */}
          <View className="items-center mb-12">
            <View className="items-center justify-center w-24 h-24 mb-4 bg-gray-100 border border-blue-100 rounded-full shadow-lg">
              <Image
                source={require("../assets/images/icon.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="w-full text-2xl font-bold text-center text-gray-800">
              Agua Lily
            </Text>
            <Text className="text-base text-center text-gray-600">
              Gestión de Interna
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">
                Usuario
              </Text>
              <TextInput
                ref={userInputRef}
                placeholder="Introduce tu usuario"
                className="px-4 py-4 text-base text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View className="mt-2">
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
                isSigningIn ? "bg-gray-400" : "bg-blue-600 active:bg-blue-700"
              }`}
              onPress={() => handleSignIn()}
              disabled={isSigningIn}
            >
              <Text className="text-base font-semibold text-center text-white">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
          <Animated.View style={keyboardPadding} />

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

          {isSigningIn && (
            <Loading
              title="Iniciando sesión"
              variant="overlay"
              message="Por favor espera"
            />
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
