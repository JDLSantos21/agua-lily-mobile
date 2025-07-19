import EquipmentCard from "@/features/equipments/components/equipmentCard";
import { useEquipments } from "@/features/equipments/hooks/useEquipments";
import Loading from "@/shared/components/Loading";
import Button from "@/shared/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  Modal,
  Alert,
} from "react-native";
import EquipmentsListError from "../../../src/features/equipments/components/EquipmentsListError";
import QRScanner from "@/features/camera/QRScanner";
import { useState } from "react";
import { router } from "expo-router";

export default function EquipmentsScreen() {
  const { data: equipments, isLoading, isError, refetch } = useEquipments();
  const [showQRScanner, setShowQRScanner] = useState(false);

  if (isLoading && !isError) {
    return (
      <Loading
        title="Cargando equipos"
        message="Por favor, espera mientras cargamos la lista de equipos."
        size="large"
        showProgress={false}
      />
    );
  }

  if (isError && !isLoading) return <EquipmentsListError refetch={refetch} />;

  const handleQRScan = (data: string) => {
    setShowQRScanner(false);
    if (!data) return;
    if (isNaN(Number(data))) {
      Alert.alert("Código QR inválido");
      return;
    }
    router.push(`/equipments/${data}`);
  };

  const equipmentCount = equipments?.data?.length || 0;

  return (
    <View style={{ flex: 1 }} className="bg-gray-50">
      {/* Botón QR flotante */}
      <Pressable
        className="absolute z-10 bottom-6 right-6 active:scale-95"
        onPress={() => setShowQRScanner(true)}
        style={{
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="relative">
          {/* Botón principal */}
          <View className="items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
            {/* Anillo interno con brillo */}
            <View className="items-center justify-center bg-blue-500 border rounded-full w-14 h-14 border-blue-400/40">
              <Ionicons name="qr-code" size={28} color="white" />
            </View>
          </View>

          {/* Badge indicador activo */}
          <View className="absolute items-center justify-center w-5 h-5 bg-green-400 border-2 border-white rounded-full -top-1 -right-1">
            <View className="w-2 h-2 bg-white rounded-full" />
          </View>

          {/* Efecto de resplandor */}
          <View
            className="absolute inset-0 rounded-full bg-blue-400/20"
            style={{
              transform: [{ scale: 1.3 }],
            }}
          />
        </View>
      </Pressable>

      {/* Modal del QR Scanner */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <QRScanner
          onCodeScanned={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>
      {/* Header */}
      <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Equipos</Text>
            <Text className="mt-1 text-sm text-gray-500">
              {equipmentCount} {equipmentCount === 1 ? "equipo" : "equipos"}{" "}
              registrados
            </Text>
          </View>
          <View className="items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <Ionicons name="settings-outline" size={20} color="#3B82F6" />
          </View>
        </View>
      </View>

      {/* Lista de equipos */}
      {equipmentCount === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
            <Ionicons name="hardware-chip-outline" size={32} color="#6B7280" />
          </View>
          <Text className="mb-2 text-xl font-semibold text-gray-900">
            No hay equipos
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            Aún no se han registrado equipos en el sistema.
          </Text>
          <Button
            onPress={refetch}
            variant="primary"
            text="Actualizar"
            icon="refresh"
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={equipments.data || []}
          renderItem={({ item }) => <EquipmentCard equipment={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}
    </View>
  );
}
