import InfoItem from "@/features/equipments/components/InfoItem";
import { useEquipmentById } from "@/features/equipments/hooks/useEquipments";
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
  Gauge,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react-native";
import {
  View,
  Text,
  ScrollView,
  Linking,
  RefreshControl,
  Alert,
} from "react-native";
import EquipmentError from "@/features/equipments/components/EquipmentError";
import EquipmentNotFound from "@/features/equipments/components/EquipmentNotFound";
import formatDate from "@/shared/utils/format-date";

export default function EquipmentDetails() {
  const { id } = useLocalSearchParams();
  const equipmentId = Array.isArray(id) ? Number(id[0]) : Number(id);
  const { saveLocation, isLoading: isSavingLocation } = useEquipmentsLocation();
  const {
    data: equipment,
    isLoading,
    isError,
    refetch,
  } = useEquipmentById(equipmentId);

  const handleGoToLocation = () => {
    openInMaps(equipment?.data?.customer_address, {
      lat: equipment?.data?.latitude,
      lng: equipment?.data?.longitude,
    });
  };

  const handleSaveLocation = async () => {
    Alert.alert(
      "Guardar ubicación",
      "¿Deseas guardar la ubicación GPS actual como dirección exacta del equipo? Esta acción actualizará la ubicación del equipo y la guardará en el sistema.",
      [
        { text: "Cancelar", style: "destructive" },
        {
          text: "Guardar",
          style: "default",
          onPress: async () => {
            if (equipmentId) {
              await saveLocation(equipmentId);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

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

                  <View className="p-4 mt-4 bg-green-50 rounded-2xl">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#10B981"
                          />
                          <Text className="ml-2 text-sm font-medium text-green-700">
                            Ubicación GPS guardada
                          </Text>
                        </View>
                        <Text className="text-xs text-green-600">
                          Si es necesario, puedes actualizar la ubicación GPS
                          del equipo en cualquier momento.
                        </Text>
                      </View>

                      <Button
                        onPress={handleSaveLocation}
                        variant="success"
                        icon="refresh"
                        disabled={isSavingLocation}
                        className="rounded-full"
                        pressedOpacity={0.5}
                      />
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

      {/* Loading overlay */}
      {isSavingLocation && (
        <Loading
          title="Guardando ubicación"
          message="Por favor, espera mientras guardamos la ubicación del equipo."
          size="large"
          variant="overlay"
          showProgress={false}
        />
      )}
    </View>
  );
}
