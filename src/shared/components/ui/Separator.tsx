import { View } from "react-native";

interface SeparatorProps {
  spicing?: number; // Espaciado vertical
  bg?: string; // Color de fondo
}

export default function Separator({
  spicing = 8,
  bg = "#E5E7EB",
}: SeparatorProps) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: bg, // Tailwind gray-300
        marginVertical: spicing, // Adjust spacing as needed
      }}
    />
  );
}
