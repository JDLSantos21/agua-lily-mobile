import { Text, View } from "react-native";

export default function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      <Text className="mb-1 text-sm font-medium text-gray-500">{label}</Text>
      <View className="flex-row items-center">
        {icon && <View className="mr-2">{icon}</View>}
        <Text className="flex-1 text-base font-semibold text-gray-900">
          {value || "No especificado"}
        </Text>
      </View>
    </View>
  );
}
