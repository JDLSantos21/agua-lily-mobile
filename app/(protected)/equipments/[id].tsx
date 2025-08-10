import InfoItem from "@/features/equipments/components/InfoItem";
import {
  useEquipmentById,
  useRegisterEquipmentDelivery,
} from "@/features/equipments/hooks/useEquipments";
import { useEquipmentsLocation } from "@/features/equipments/hooks/useEquipmentsLocation";
import {
  getEquipmentStatusBadgeBg,
  getEquipmentStatusBadgeColor,
} from "@/features/equipments/utils/equipmentBadgeColor";
import Loading from "@/shared/components/Loading";
import Button from "@/shared/components/ui/Button";
import formatPhoneNumber from "@/shared/utils/format-number";
import { openInMaps } from "@/shared/utils/maps";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  CalendarDays,
  CheckCircle,
  Gauge,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react-native";
import { View, Text, ScrollView, Linking, RefreshControl } from "react-native";
import EquipmentError from "@/features/equipments/components/EquipmentError";
import EquipmentNotFound from "@/features/equipments/components/EquipmentNotFound";
import formatDate from "@/shared/utils/format-date";
import QRScanner from "@/features/camera/QRScanner";
import { useState, useCallback } from "react";
import { getCurrentLocation } from "@/shared/utils/location";
import { Modal } from "@/shared/components/ui/Modal";
import { useAlert } from "@/shared/components/ui/Alert";
import {
  useQRScanner,
  QRScannerAction,
} from "@/features/camera/hooks/useQRScanner";

export default function EquipmentDetails() {
  const { id } = useLocalSearchParams();
  const equipmentId = Array.isArray(id) ? id[0] : id;
  const { saveLocation, isLoading: isSavingLocation } = useEquipmentsLocation();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const alert = useAlert();

  const {
    data: equipment,
    isLoading,
    isError,
    refetch,
  } = useEquipmentById(equipmentId);

  const registerDeliveryMutation = useRegisterEquipmentDelivery();

  // Función unificada para manejar códigos QR escaneados
  const handleQRCodeScanned = useCallback(
    async (data: string, action: QRScannerAction) => {
      // Validar que el código QR coincida con el serial number
      if (data.trim() !== equipment?.data?.serial_number?.trim()) {
        console.log("Serial number mismatch:", {
          scanned: data.trim(),
          expected: equipment?.data?.serial_number?.trim(),
        });

        alert.warning(
          "Equipo no coincide",
          "El QR escaneado no coincide con el número de serie del equipo. Por favor, verifica el código QR e inténtalo de nuevo."
        );
        return;
      }

      // Obtener ubicación actual
      try {
        setIsGettingLocation(true);
        const { latitude, longitude } = await getCurrentLocation();

        if (action === "delivery") {
          await registerDeliveryMutation.mutateAsync({
            id: equipment.data.id,
            latitude,
            longitude,
          });
        } else if (action === "save-location") {
          if (equipmentId && equipment?.data?.id) {
            await saveLocation(equipment.data.id, latitude, longitude);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        alert.error("Ocurrió un error", errorMessage);
        console.log("Error en operación:", error);
      } finally {
        setIsGettingLocation(false);
      }
    },
    [
      equipment?.data?.serial_number,
      equipment?.data?.id,
      registerDeliveryMutation,
      equipmentId,
      saveLocation,
      alert,
    ]
  );

  // Hook para manejar el escáner QR de forma reutilizable
  const qrScanner = useQRScanner({
    onQRScanned: handleQRCodeScanned,
  });

  const handleGoToLocation = useCallback(() => {
    openInMaps(equipment?.data?.customer_address, {
      lat: equipment?.data?.latitude,
      lng: equipment?.data?.longitude,
    });
  }, [
    equipment?.data?.customer_address,
    equipment?.data?.latitude,
    equipment?.data?.longitude,
  ]);

  const handleSaveLocation = useCallback(async () => {
    const confirmSaveLocation = () => {
      setTimeout(() => {
        alert.confirm(
          "Escanear código QR",
          "Para guardar la ubicación, necesitas escanear el código QR del equipo para verificar su identidad.",
          () => qrScanner.openScanner("save-location"),
          null,
          "Escanear QR"
        );
      }, 50);
    };

    alert.confirm(
      "Guardar ubicación",
      "¿Deseas guardar la ubicación GPS actual como dirección exacta del equipo? Esta acción actualizará la ubicación del equipo y la guardará en el sistema.",
      confirmSaveLocation
    );
  }, [qrScanner, alert]);

  console.log(
    equipment?.data?.current_customer_id,
    equipment?.data?.delivered_date
  );

  return (
    <View style={{ flex: 1 }} className="bg-gray-50">
      {isLoading ? (
        <Loading
          title="Cargando equipo"
          message="Por favor, espera mientras cargamos los detalles del equipo."
          size="large"
          showProgress={false}
        />
      ) : isError && !isLoading ? (
        <EquipmentError onRetry={refetch} />
      ) : !equipment?.data ? (
        <EquipmentNotFound onRetry={refetch} />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {/* Header con Status y Número de Serie */}
          <View className="mx-4 mt-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  {equipment?.data?.type}
                </Text>
                <Text className="mt-1 text-2xl font-bold text-gray-900">
                  #{equipment?.data?.serial_number || "Sin serie"}
                </Text>
              </View>
              <View
                className={`px-4 py-2 ${getEquipmentStatusBadgeBg(
                  equipment?.data?.status
                )} rounded-full`}
              >
                <Text
                  className={`text-sm font-semibold ${getEquipmentStatusBadgeColor(
                    equipment?.data?.status
                  )}`}
                >
                  {equipment?.data?.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Registrar entrega - solo mostrar si no se ha entregado Y hay cliente asignado */}
            {!equipment?.data?.delivered_date &&
              equipment?.data?.current_customer_id && (
                <View className="p-6 mb-6 border-2 border-orange-200 bg-orange-50 rounded-3xl">
                  {/* Header de alerta */}
                  <View className="flex-row items-center mb-5">
                    <View>
                      <CheckCircle size={22} color="orange" />
                    </View>
                    <View className="flex-1 ml-4">
                      <Text className="text-lg font-bold text-orange-800">
                        Entrega pendiente
                      </Text>
                      <Text className="mt-1 text-sm font-medium text-orange-600">
                        Este equipo requiere que se registre la entrega
                      </Text>
                    </View>
                  </View>

                  {/* Información adicional */}
                  <View className="p-4 mb-5 border border-orange-100 bg-white/70 rounded-2xl">
                    <Text className="text-sm leading-relaxed text-gray-700">
                      El equipo está asignado al cliente pero aún no ha sido
                      entregado. Es necesario completar el proceso de entrega.
                    </Text>
                  </View>

                  {/* Botón de acción principal */}
                  <Button
                    variant="location"
                    text="Completar entrega ahora"
                    icon="checkmark-circle"
                    onPress={() => setIsModalOpen(true)}
                    disabled={registerDeliveryMutation.isPending}
                  />
                </View>
              )}

            {/* Información básica del equipo */}
            <View className="p-4 bg-white shadow-sm rounded-2xl">
              <View className="flex-row items-center justify-between mb-3">
                <InfoItem
                  label="Modelo"
                  value={equipment?.data?.model}
                  icon={<Settings size={16} color="#6B7280" />}
                />
                <InfoItem
                  label="Capacidad"
                  value={equipment?.data?.capacity}
                  icon={<Gauge size={16} color="#6B7280" />}
                />
              </View>

              <View className="pt-3 border-t border-gray-100">
                <InfoItem
                  label="Ubicación actual"
                  value={equipment?.data?.customer_address || "No especificado"}
                  icon={<MapPin size={16} color="#6B7280" />}
                />
              </View>

              <View className="pt-3 mt-3 border-t border-gray-100">
                <InfoItem
                  label="Registrado"
                  value={formatDate(equipment?.data?.created_at)}
                  icon={<CalendarDays size={16} color="#6B7280" />}
                />
              </View>
            </View>
          </View>

          {/* Información del Cliente Asociado */}
          {equipment?.data?.current_customer_id && (
            <View className="mx-4 mb-6 bg-white shadow-sm rounded-3xl">
              <View className="p-6">
                <View className="flex-row items-center mb-5">
                  <View className="items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <User size={20} color="#3B82F6" />
                  </View>
                  <Text className="ml-4 text-lg font-semibold text-gray-900">
                    Cliente asociado
                  </Text>
                </View>

                <View className="space-y-4">
                  <View>
                    <Text className="mb-1 text-2xl font-bold text-gray-900">
                      {equipment?.data?.customer_name || "No especificado"}
                    </Text>
                  </View>

                  {equipment?.data?.customer_phone && (
                    <View className="flex-row items-center px-4 py-3 mb-2 bg-gray-50 rounded-2xl">
                      <View className="items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <Phone size={16} color="#10B981" />
                      </View>
                      <Text className="ml-3 text-base font-medium text-gray-900">
                        {formatPhoneNumber(equipment?.data?.customer_phone)}
                      </Text>
                    </View>
                  )}

                  <View className="pt-3 border-t border-gray-100">
                    <InfoItem
                      label="Fecha de asignación"
                      value={
                        formatDate(
                          equipment?.data?.assigned_date,
                          "DD MMMM, YYYY"
                        ) || "No especificado"
                      }
                      icon={<CalendarDays size={16} color="#6B7280" />}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Ubicación GPS   */}
          {equipment?.data?.location_created_at && (
            <View className="mx-4 mb-6 bg-white shadow-sm rounded-3xl">
              <View className="p-6">
                <View className="flex-row items-center mb-5">
                  <View className="items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <MapPin size={20} color="#10B981" />
                  </View>
                  <Text className="ml-4 text-lg font-semibold text-gray-900">
                    Ubicación GPS
                  </Text>
                </View>

                <View className="space-y-4">
                  <View className="flex-row items-center justify-between">
                    <InfoItem
                      label="Latitud"
                      value={equipment?.data?.latitude}
                      icon={<MapPin size={16} color="#6B7280" />}
                    />
                    <InfoItem
                      label="Longitud"
                      value={equipment?.data?.longitude}
                      icon={<MapPin size={16} color="#6B7280" />}
                    />
                  </View>

                  <View className="pt-3 border-t border-gray-100">
                    <InfoItem
                      label="Guardado el"
                      value={formatDate(equipment?.data?.location_created_at)}
                      icon={<CalendarDays size={16} color="#6B7280" />}
                    />
                  </View>

                  <View
                    className={`p-4 mt-4 ${equipment.data?.require_gps_update === 0 ? "bg-green-50" : "bg-yellow-50"} rounded-2xl`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          {equipment.data?.require_gps_update === 0 ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color="#10B981"
                            />
                          ) : (
                            <Ionicons
                              name="alert-circle"
                              size={18}
                              color="#F59E0B"
                            />
                          )}

                          <Text
                            className={`ml-2 text-sm font-medium ${equipment.data?.require_gps_update === 0 ? "text-green-700" : "text-yellow-700"}`}
                          >
                            {equipment.data?.require_gps_update === 0
                              ? "Ubicación GPS guardada"
                              : "Se requiere actualización"}
                          </Text>
                        </View>
                        <Text
                          className={`text-xs ${equipment.data?.require_gps_update === 0 ? "text-green-600" : "text-yellow-600"}`}
                        >
                          {equipment.data?.require_gps_update === 0
                            ? "La ubicación GPS para este equipo está registrada."
                            : "La ubicación GPS requiere actualización."}
                        </Text>
                      </View>

                      {equipment.data?.require_gps_update === 1 && (
                        <Button
                          onPress={handleSaveLocation}
                          variant={
                            Number(equipment.data?.require_gps_update) === 0
                              ? "success"
                              : "location"
                          }
                          icon="refresh"
                          disabled={isSavingLocation}
                          className="rounded-full"
                          pressedOpacity={0.5}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {!equipment?.data?.location_created_at && (
            <View className="mx-4 mb-6">
              <View className="p-4 border border-yellow-200 bg-yellow-50 rounded-2xl">
                <View className="flex-row items-start">
                  <Ionicons name="warning" size={20} color="#F59E0B" />
                  <View className="flex-1 ml-3">
                    <Text className="mb-1 text-sm font-medium text-yellow-800">
                      Ubicación GPS no guardada
                    </Text>
                    <Text className="mb-3 text-xs text-yellow-700">
                      Este equipo no tiene ubicación GPS establecida, es
                      estrictamente necesario guardar la ubicación exacta del
                      equipo al momento de la entrega del mismo.
                    </Text>
                    <Button
                      onPress={handleSaveLocation}
                      variant="warning"
                      size="sm"
                      text="Establecer ubicación actual"
                      icon="location"
                      disabled={isSavingLocation}
                      pressedOpacity={0.5}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Acciones Rápidas */}
          <View className="mx-4 mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Acciones Rápidas
            </Text>

            {/* Mostrar información de entrega si ya fue entregado */}
            {/* {equipment?.data?.delivered_date && (
              <View className="p-4 mb-3 border border-green-200 bg-green-50 rounded-2xl">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text className="ml-2 text-sm font-medium text-green-700">
                    Equipo entregado
                  </Text>
                </View>
                <Text className="text-xs text-green-600">
                  Entregado el {formatDate(equipment?.data?.delivered_date)}
                </Text>
              </View>
            )} */}

            {equipment?.data?.latitude && equipment?.data?.longitude && (
              <Button
                variant="secondary"
                text="Ver ubicación en el mapa"
                icon="map"
                onPress={handleGoToLocation}
                className="mb-3"
              />
            )}

            {equipment?.data?.customer_phone && (
              <View className="flex-row gap-2">
                <Button
                  icon="call"
                  text="Llamar"
                  variant="primary"
                  className="flex-1"
                  href={`tel:${equipment?.data?.customer_phone}`}
                />

                <Button
                  icon="logo-whatsapp"
                  text="WhatsApp"
                  variant="whatsapp"
                  className="flex-1"
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/${equipment?.data?.customer_phone}`
                    )
                  }
                />
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Loading overlay for getting location */}
      {isGettingLocation && (
        <Loading
          title="Obteniendo ubicación"
          message="Por favor, espera mientras obtenemos tu ubicación actual para registrar la entrega."
          size="large"
          variant="overlay"
          showProgress={false}
        />
      )}

      {/* Loading overlay for saving location */}
      {isSavingLocation && (
        <Loading
          title="Guardando ubicación"
          message="Por favor, espera mientras guardamos la ubicación del equipo."
          size="large"
          variant="overlay"
          showProgress={false}
        />
      )}

      {/* Loading overlay for registering delivery */}
      {registerDeliveryMutation.isPending && (
        <Loading
          title="Registrando entrega"
          message="Por favor, espera mientras registramos la entrega del equipo."
          size="large"
          variant="overlay"
          showProgress={false}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onBackdropPress={() => setIsModalOpen(false)}
        animationIn="fadeInUp"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
      >
        <View className="mx-4 bg-white shadow-2xl rounded-3xl">
          {/* Header con ícono */}
          <View className="items-center pt-8 pb-2">
            <View className="items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50">
              <Ionicons name="qr-code-outline" size={28} color="#3B82F6" />
            </View>
            <Text className="text-xl font-bold text-gray-900">
              Confirmar entrega
            </Text>
          </View>

          {/* Contenido principal */}
          <View className="px-6 pb-2">
            <Text className="mb-4 text-base leading-relaxed text-center text-gray-600">
              ¿Estás seguro de que deseas completar la entrega del equipo?
            </Text>

            <View className="p-4 mb-6 border border-blue-100 bg-blue-50 rounded-2xl">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="flex-1 ml-3 text-sm leading-relaxed text-blue-700">
                  Para registrar la entrega, necesitas escanear el código QR en
                  la etiqueta del equipo para su verificación.
                </Text>
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View className="flex-row p-6 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              text="Cancelar"
              onPress={() => setIsModalOpen(false)}
              className="flex-1 mr-3"
            />
            <Button
              variant="primary"
              icon="qr-code"
              text="Escanear QR"
              onPress={() => {
                setIsModalOpen(false);
                qrScanner.openScanner("delivery");
              }}
              className="flex-1 ml-3"
            />
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={qrScanner.isVisible}
        onCodeScanned={qrScanner.handleCodeScanned}
        onClose={qrScanner.closeScanner}
      />
    </View>
  );
}
