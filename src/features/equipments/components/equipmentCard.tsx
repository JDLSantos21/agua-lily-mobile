import { Text, View, TouchableOpacity } from "react-native";
import { Equipment } from "../types";
import { User, MapPin, Settings, Gauge } from "lucide-react-native";
import { Link } from "expo-router";
import {
  getEquipmentStatusBadgeBg,
  getEquipmentStatusBadgeColor,
} from "../utils/equipmentBadgeColor";
import { Ionicons } from "@expo/vector-icons";

export default function EquipmentCard({
  equipment,
}: {
  equipment?: Equipment;
}) {
  return (
    <Link href={`/equipments/${equipment?.id}`} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="overflow-hidden bg-white shadow-sm rounded-2xl">
          {/* Header del card */}
          <View className="p-4 pb-3">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-100 rounded-full">
                    <Ionicons name="settings" size={16} color="#6B7280" />
                  </View>
                  <Text className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                    {equipment.type}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-900 ml-11">
                  {equipment.model}
                </Text>
                <Text className="text-sm text-gray-600 ml-11">
                  #{equipment.serial_number || "Sin serie"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 ${getEquipmentStatusBadgeBg(
                  equipment.status
                )} rounded-full`}
              >
                <Text
                  className={`text-xs font-semibold ${getEquipmentStatusBadgeColor(
                    equipment.status
                  )}`}
                >
                  {equipment.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Especificaciones */}
            <View className="flex-row items-center justify-between px-4 py-3 mb-3 bg-gray-50 rounded-xl">
              <View className="flex-row items-center flex-1">
                <Settings size={14} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">
                  {equipment.model}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Gauge size={14} color="#6B7280" />
                <Text className="ml-2 text-sm font-medium text-gray-900">
                  {equipment.capacity}
                </Text>
              </View>
            </View>
          </View>

          {/* Información del cliente */}
          <View className="px-4 pb-4">
            {!equipment.current_customer_id ? (
              <View className="flex-row items-center px-3 py-2 border rounded-lg bg-amber-50 border-amber-200">
                <Ionicons name="information-circle" size={16} color="#F59E0B" />
                <Text className="flex-1 ml-2 text-sm text-amber-700">
                  Sin cliente asociado
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {/* Nombre del cliente */}
                <View className="flex-row items-center px-3 py-2 rounded-lg bg-blue-50">
                  <View className="items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                    <User size={12} color="#3B82F6" />
                  </View>
                  <Text className="flex-1 ml-3 text-sm font-medium text-gray-900">
                    {equipment.customer_name || "Cliente sin nombre"}
                  </Text>
                </View>

                {/* Dirección */}
                {equipment.customer_address && (
                  <View className="flex-row items-start px-3 py-2 rounded-lg bg-gray-50">
                    <View className="items-center justify-center w-6 h-6 bg-gray-100 rounded-full mt-0.5">
                      <MapPin size={12} color="#6B7280" />
                    </View>
                    <Text className="flex-1 ml-3 text-sm leading-5 text-gray-700">
                      {equipment.customer_address}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
