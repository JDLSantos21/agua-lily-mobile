import { ActivityIndicator, Text, View } from "react-native";

type LoadingProps = {
  title?: string;
  message?: string;
  color?: string;
  size?: "small" | "large";
  className?: string;
};

export default function Loading({
  title = "Cargando",
  message,
  color = "#3B82F6",
  size = "large",
  className = "",
}: LoadingProps) {
  return (
    <View className={`items-center justify-center flex-1 ${className}`}>
      <ActivityIndicator size={size} color={color} />
      <Text className="mt-4 text-lg font-medium text-gray-700">{title}</Text>
      {message && <Text className="mt-1 text-sm text-gray-500">{message}</Text>}
    </View>
  );
}
