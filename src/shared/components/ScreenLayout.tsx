import { View } from "react-native";

export default function ScreenLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      style={{ flex: 1, paddingHorizontal: 20 }}
      className={`${className ? className : "bg-white"}`}
    >
      {children}
    </View>
  );
}
