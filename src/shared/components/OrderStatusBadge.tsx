import { Text } from "react-native";

export default function OrderStatusBadge({ status }) {
  const statusStyles = {
    pendiente: "bg-yellow-100 text-yellow-800",
    preparando: "bg-blue-100 text-blue-800",
    despachado: "bg-purple-100 text-purple-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };

  return (
    <Text
      className={`py-2 px-8 justify-center items-center rounded-full text-sm font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Text>
  );
}
