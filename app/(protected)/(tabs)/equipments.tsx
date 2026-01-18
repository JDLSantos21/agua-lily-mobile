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
} from "react-native";
import EquipmentsListError from "../../../src/features/equipments/components/EquipmentsListError";
import QRScanner from "@/features/camera/QRScanner";
import { useState } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAlert } from "@/shared/components/ui/Alert";

export default function EquipmentsScreen() {
  const alert = useAlert();
  const { data: equipments, isLoading, isError, refetch } = useEquipments();
  const [showQRScanner, setShowQRScanner] = useState(false);

  if (isLoading && !isError) {
    return (
      <Loading
        title="Cargando equipos"
        message="Por favor, espera un momento..."
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
      alert.error("Error", "Código QR inválido");
      return;
    }
    router.push(`/equipments/${data}`);
  };

  const handleOpenScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowQRScanner(true);
  };

  const equipmentCount = equipments?.data?.length || 0;

  // Contar equipos que necesitan atención (sin GPS)
  const needsAttentionCount =
    equipments?.data?.filter((eq) => !eq.location_created_at).length || 0;

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 12, paddingTop: 20, paddingBottom: 12 }}>
      {/* Título */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>
          Equipos
        </Text>
      </View>

      {/* Contador minimalista */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <Text style={{ fontSize: 15, color: "#6B7280" }}>En tu inventario</Text>
        <View
          style={{
            backgroundColor: "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#4B5563",
            }}
          >
            {equipmentCount}
          </Text>
        </View>
      </View>

      {/* Alerta si hay equipos pendientes de GPS */}
      {needsAttentionCount > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FEF3C7",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <Ionicons name="alert-circle" size={18} color="#D97706" />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              color: "#92400E",
              flex: 1,
            }}
          >
            {needsAttentionCount}{" "}
            {needsAttentionCount === 1
              ? "equipo requiere"
              : "equipos requieren"}{" "}
            ubicación GPS
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "#F3F4F6",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Ionicons name="hardware-chip-outline" size={44} color="#9CA3AF" />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          color: "#111827",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No hay equipos
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 24,
        }}
      >
        Escanea un código QR para ver los detalles de un equipo
      </Text>
      <Button
        onPress={refetch}
        variant="secondary"
        text="Actualizar"
        icon="refresh"
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
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

      {/* Lista de equipos */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={equipments?.data || []}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 12 }}>
            <EquipmentCard equipment={item} />
          </View>
        )}
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
          flexGrow: 1,
          paddingBottom: 100,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Botón QR flotante */}
      <Pressable
        onPress={handleOpenScanner}
        style={{
          position: "absolute",
          bottom: 24,
          right: 16,
        }}
        accessibilityLabel="Escanear código QR"
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: pressed ? "#2563EB" : "#3B82F6",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            }}
          >
            <Ionicons name="qr-code" size={26} color="#FFFFFF" />
          </View>
        )}
      </Pressable>
    </View>
  );
}
