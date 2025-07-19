import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleProp, ViewStyle, TextStyle } from "react-native";

interface InfoCardProps {
  children: React.ReactNode;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export default function InfoCard({
  children,
  title,
  icon,
  style,
  titleStyle,
}: InfoCardProps) {
  return (
    <View className="mx-4 mb-4 bg-white shadow-sm rounded-2xl" style={style}>
      <View className="flex-row items-center p-4 pb-3 border-b border-gray-50">
        <Ionicons name={icon} size={20} color="#3B82F6" />
        <Text
          className="ml-3 text-lg font-semibold text-gray-900"
          style={titleStyle}
        >
          {title}
        </Text>
      </View>
      <View className="p-4 pt-3">{children}</View>
    </View>
  );
}
