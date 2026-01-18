import Button from "@/shared/components/ui/Button";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QRScannerProps {
  onCodeScanned?: (data: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onCodeScanned, onClose }: QRScannerProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="items-center flex-1 bg-gray-900">
        <StatusBar style="light" />

        {/* Header con botón cerrar */}
        <View
          style={{ marginTop: insets.top + 10 }}
          className="absolute z-10 flex-row items-center justify-between flex-1 w-full px-4"
        >
          <TouchableOpacity
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            className="items-center justify-center w-10 h-10 rounded-full"
          >
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-white">Escáner QR</Text>

          <TouchableOpacity
            onPress={onClose}
            className="items-center justify-center w-10 h-10 rounded-full"
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center justify-center w-20 h-20 mb-6 rounded-full bg-white/10">
            <Ionicons name="camera" size={32} color="white" />
          </View>
          <Text className="mb-2 text-xl font-semibold text-center text-white">
            Permiso de cámara requerido
          </Text>
          <Text className="mb-6 text-center text-gray-300">
            Necesitamos acceso a tu cámara para escanear códigos QR
          </Text>
          <Button
            onPress={requestPermission}
            text="Permitir acceso a la cámara"
            variant="primary"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => onCodeScanned?.(data)}
      />

      <View
        className="absolute z-10 items-center justify-between w-full h-full px-4"
        pointerEvents="box-none"
      >
        {/* Header con botón cerrar */}
        <View
          style={{ marginTop: insets.top + 10 }}
          className="absolute z-10 flex-row items-center justify-between w-full px-4"
        >
          <TouchableOpacity
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            className="items-center justify-center w-10 h-10 rounded-full"
          >
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-white">Escáner QR</Text>
          <TouchableOpacity
            onPress={onClose}
            className="items-center justify-center w-10 h-10 rounded-full"
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* Marco de escaneo */}
        <View className="items-center justify-center flex-1 w-full px-8">
          <View className="relative items-center justify-center w-80 h-80">
            {/* Fondo semi-transparente */}
            <View className="absolute inset-0 bg-black/10 rounded-3xl" />

            {/* Marco principal con bordes redondeados */}
            <View className="relative w-full h-full overflow-hidden border-2 border-white/60 rounded-3xl">
              {/* Esquinas animadas del marco */}
              <View className="absolute w-8 h-8 border-t-4 border-l-4 border-blue-400 top-4 left-4 rounded-tl-2xl" />
              <View className="absolute w-8 h-8 border-t-4 border-r-4 border-blue-400 top-4 right-4 rounded-tr-2xl" />
              <View className="absolute w-8 h-8 border-b-4 border-l-4 border-blue-400 bottom-4 left-4 rounded-bl-2xl" />
              <View className="absolute w-8 h-8 border-b-4 border-r-4 border-blue-400 bottom-4 right-4 rounded-br-2xl" />

              {/* Línea de escaneo animada */}
              <View className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />

              {/* Área de escaneo central */}
              <View className="absolute border border-dashed inset-8 border-white/30 rounded-2xl" />
            </View>

            {/* Texto de instrucción con mejor diseño */}
            <View className="absolute left-0 right-0 px-4 -bottom-16">
              <Text className="mt-2 text-sm text-center text-gray-300">
                Mantén el dispositivo estable para un mejor escaneo
              </Text>
            </View>
          </View>
        </View>

        {/* Controles inferiores */}
        <View
          style={{ marginBottom: insets.bottom + 20 }}
          className="px-4 pb-8"
        >
          <View className="flex-row justify-center">
            <Button
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
              variant="secondary"
              icon="refresh"
              size="lg"
              className="rounded-full"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
