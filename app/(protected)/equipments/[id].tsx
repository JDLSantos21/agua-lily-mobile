import {
  useEquipmentById,
  useRegisterEquipmentDelivery,
} from "@/features/equipments/hooks/useEquipments";
import { useEquipmentsLocation } from "@/features/equipments/hooks/useEquipmentsLocation";
import Loading from "@/shared/components/Loading";
import Button from "@/shared/components/ui/Button";
import formatPhoneNumber from "@/shared/utils/format-number";
import { openInMaps } from "@/shared/utils/maps";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Linking,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from "react-native";
import EquipmentError from "@/features/equipments/components/EquipmentError";
import EquipmentNotFound from "@/features/equipments/components/EquipmentNotFound";
import formatDate from "@/shared/utils/format-date";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import QRScanner from "@/features/camera/QRScanner";
import { useAlert } from "@/shared/components/ui/Alert";
import * as Location from "expo-location";

// Status config
const getStatusConfig = (status: string) => {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    activo: { bg: "#D1FAE5", text: "#065F46", label: "Activo" },
    inactivo: { bg: "#FEE2E2", text: "#991B1B", label: "Inactivo" },
    mantenimiento: { bg: "#FEF3C7", text: "#92400E", label: "Mantenimiento" },
    reparacion: { bg: "#DBEAFE", text: "#1E40AF", label: "Reparación" },
  };
  return configs[status?.toLowerCase()] || configs.activo;
};

export default function EquipmentDetails() {
  const { id } = useLocalSearchParams();
  const alert = useAlert();
  const equipmentId = Array.isArray(id) ? Number(id[0]) : Number(id);
  const { saveLocation, isLoading: isSavingLocation } = useEquipmentsLocation();
  const {
    data: equipment,
    isLoading,
    isError,
    refetch,
  } = useEquipmentById(equipmentId);

  const [showQRScanner, setShowQRScanner] = useState(false);

  const registerDeliveryMutation = useRegisterEquipmentDelivery();

  const handleGoToLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openInMaps(equipment?.data?.customer_address, {
      lat: equipment?.data?.latitude,
      lng: equipment?.data?.longitude,
    });
  };

  const handleSaveLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    alert.confirm(
      "Guardar ubicación",
      "¿Deseas guardar la ubicación GPS actual?",
      async () => {
        if (equipmentId) {
          await saveLocation(equipmentId);
          refetch();
        }
      },
    );
  };

  // Manejar escaneo de QR para completar entrega
  const handleQRScan = async (scannedData: string) => {
    setShowQRScanner(false);

    if (!scannedData) return;

    console.log("QR escaneado:", scannedData);

    // Verificar que el QR escaneado coincida con el serial number del equipo
    if (scannedData !== equipment.data.serial_number) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert.error(
        "QR incorrecto",
        "El código QR escaneado no corresponde a este equipo. Asegúrate de escanear el QR correcto.",
      );
      return;
    }

    // Código coincide - guardar ubicación para completar entrega
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert.error(
          "Permiso denegado",
          "Se necesitan permisos de ubicación para completar la entrega",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      registerDeliveryMutation.mutate(
        {
          id: equipmentId,
          latitude,
          longitude,
        },
        {
          onSuccess: (response) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            alert.success(
              "Entrega completada",
              "La entrega del equipo se ha registrado correctamente.",
              () => refetch(),
            );
          },
          onError: (error) => {
            alert.error(
              "Error",
              "No se pudo registrar la entrega. Inténtalo de nuevo.",
            );
            console.error(error);
          },
        },
      );
    } catch (error) {
      alert.error("Error", "Ocurrió un error al obtener la ubicación.");
      console.error(error);
    }
  };

  const handleOpenDeliveryScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowQRScanner(true);
  };

  // Card component
  const Card = ({ children, style = {} }) => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        ...style,
      }}
    >
      {children}
    </View>
  );

  // Section header
  const SectionHeader = ({ icon, iconColor, iconBg, title }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text
        style={{
          marginLeft: 14,
          fontSize: 18,
          fontWeight: "600",
          color: "#111827",
          flex: 1,
        }}
      >
        {title}
      </Text>
    </View>
  );

  const statusConfig = getStatusConfig(equipment?.data?.status || "activo");

  // Determinar si está pendiente de entrega (asignado pero sin ubicación)
  const isPendingDelivery =
    equipment?.data?.assigned_date && !equipment?.data?.location_created_at;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Equipo #${equipmentId}`,
          headerTitleStyle: {
            color: "#111827",
            fontSize: 17,
            fontWeight: "600",
          },
          headerTintColor: "#3B82F6",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: false,
        }}
      />

      {/* Modal QR Scanner para completar entrega */}
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

      {isLoading ? (
        <Loading
          title="Cargando equipo"
          message="Por favor, espera..."
          size="large"
          showProgress={false}
        />
      ) : isError && !isLoading ? (
        <EquipmentError onRetry={refetch} />
      ) : !equipment?.data ? (
        <EquipmentNotFound onRetry={refetch} />
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
          >
            {/* ALERTA: Entrega pendiente */}
            {isPendingDelivery && (
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 16,
                  padding: 20,
                  backgroundColor: "#FEF3C7",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#FCD34D",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: "#F59E0B",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="time" size={26} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#92400E",
                        marginBottom: 4,
                      }}
                    >
                      Entrega pendiente
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#B45309",
                        lineHeight: 20,
                        marginBottom: 16,
                      }}
                    >
                      Este equipo está asignado pero aún no se ha completado la
                      entrega. Escanea el código QR del equipo para confirmar.
                    </Text>
                    <Button
                      onPress={handleOpenDeliveryScanner}
                      variant="warning"
                      text="Completar entrega"
                      icon="qr-code"
                      fullWidth
                      size="lg"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Header con info básica */}
            <Card>
              <View style={{ padding: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {equipment?.data?.type}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#111827",
                        marginTop: 4,
                      }}
                    >
                      {equipment?.data?.model}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6B7280",
                        marginTop: 2,
                      }}
                    >
                      #{equipment?.data?.serial_number || "Sin serie"}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 12,
                      backgroundColor: statusConfig.bg,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: statusConfig.text,
                      }}
                    >
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>

                {/* Capacidad */}
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#F9FAFB",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="water" size={18} color="#3B82F6" />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {equipment?.data?.capacity || "N/A"}
                    </Text>
                    <Text
                      style={{ marginLeft: 4, fontSize: 14, color: "#6B7280" }}
                    >
                      de capacidad
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Cliente asociado */}
            {equipment?.data?.current_customer_id && (
              <Card>
                <SectionHeader
                  icon="person"
                  iconColor="#3B82F6"
                  iconBg="#DBEAFE"
                  title="Cliente"
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#111827",
                      marginBottom: 14,
                    }}
                  >
                    {equipment?.data?.customer_name || "No especificado"}
                  </Text>

                  {/* Teléfono */}
                  {equipment?.data?.customer_phone && (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `tel:${equipment?.data?.customer_phone}`,
                        )
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        backgroundColor: "#F0FDF4",
                        borderRadius: 14,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: "#10B981",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="call" size={18} color="#FFFFFF" />
                      </View>
                      <Text
                        style={{
                          marginLeft: 12,
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#065F46",
                        }}
                      >
                        {formatPhoneNumber(equipment?.data?.customer_phone)}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#10B981"
                        style={{ marginLeft: "auto" }}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Dirección */}
                  {equipment?.data?.customer_address && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        padding: 14,
                        backgroundColor: "#FFF7ED",
                        borderRadius: 14,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: "#F97316",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="location" size={18} color="#FFFFFF" />
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          fontSize: 15,
                          lineHeight: 22,
                          color: "#9A3412",
                        }}
                      >
                        {equipment?.data?.customer_address}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            )}

            {/* GPS Status - solo mostrar si ya fue entregado */}
            {!isPendingDelivery && (
              <Card style={{ marginBottom: 0 }}>
                <SectionHeader
                  icon="location"
                  iconColor={
                    equipment?.data?.location_created_at ? "#10B981" : "#F59E0B"
                  }
                  iconBg={
                    equipment?.data?.location_created_at ? "#D1FAE5" : "#FEF3C7"
                  }
                  title="Ubicación GPS"
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                  {equipment?.data?.location_created_at ? (
                    <View
                      style={{
                        padding: 14,
                        backgroundColor: "#F0FDF4",
                        borderRadius: 14,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#10B981"
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              color: "#065F46",
                            }}
                          >
                            Ubicación guardada
                          </Text>
                          <Text style={{ fontSize: 12, color: "#10B981" }}>
                            {formatDate(equipment?.data?.location_created_at)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleSaveLocation}
                          disabled={isSavingLocation}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: "#10B981",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        padding: 14,
                        backgroundColor: "#FEF3C7",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#FCD34D",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <Ionicons name="warning" size={20} color="#D97706" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              color: "#92400E",
                              marginBottom: 4,
                            }}
                          >
                            GPS no guardado
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              color: "#B45309",
                              marginBottom: 12,
                            }}
                          >
                            Guarda la ubicación exacta del equipo
                          </Text>
                          <Button
                            onPress={handleSaveLocation}
                            variant="location"
                            text="Guardar ubicación"
                            icon="location"
                            disabled={isSavingLocation}
                            size="sm"
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </Card>
            )}

            {/* Acciones Rápidas */}
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 14,
                }}
              >
                Acciones rápidas
              </Text>

              {equipment?.data?.latitude && equipment?.data?.longitude && (
                <Button
                  variant="secondary"
                  text="Ver en Maps"
                  icon="navigate"
                  fullWidth
                  onPress={handleGoToLocation}
                />
              )}

              {equipment?.data?.customer_phone && (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      icon="call"
                      text="Llamar"
                      variant="primary"
                      fullWidth
                      href={`tel:${equipment?.data?.customer_phone}`}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      icon="logo-whatsapp"
                      text="WhatsApp"
                      variant="whatsapp"
                      fullWidth
                      onPress={() =>
                        Linking.openURL(
                          `https://wa.me/${equipment?.data?.customer_phone}`,
                        )
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Loading overlay */}
          {registerDeliveryMutation.isPending && (
            <Loading
              title="Completando entrega"
              message="Guardando ubicación del equipo..."
              size="large"
              variant="overlay"
              showProgress={false}
            />
          )}

          {isSavingLocation && (
            <Loading
              title="Actualizando ubicación"
              message="Guardando ubicación del equipo..."
              size="large"
              variant="overlay"
              showProgress={false}
            />
          )}
        </>
      )}
    </View>
  );
}
