import { View } from "react-native";

export default function ScreenLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`flex-1 px-5 bg-white ${className}`}>{children}</View>
  );
}
