// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks/useAuth";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => signIn(email, password),
    onError: (e: any) => Alert.alert("Error", e.message),
  });

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-8 text-3xl font-bold text-center text-blue-600">
        Iniciar Sesión
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        className="px-4 py-3 mb-4 border border-gray-300 rounded-lg"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        className="px-4 py-3 mb-6 border border-gray-300 rounded-lg"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="py-3 bg-blue-600 rounded-lg"
        onPress={() => mutate()}
        disabled={isPending}
      >
        <Text className="font-semibold text-center text-white">
          {isPending ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
