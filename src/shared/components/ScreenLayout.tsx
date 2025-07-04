import { View } from "react-native";

export default function ScreenLayout({ children }) {
  return <View className="flex-1 px-5">{children}</View>;
}
