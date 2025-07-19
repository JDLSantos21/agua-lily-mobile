export const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
    case "pendiente":
      return "time-outline";
    case "processing":
    case "preparando":
      return "sync-outline";
    case "shipped":
    case "despachado":
      return "car-outline";
    case "delivered":
    case "entregado":
      return "checkmark-circle-outline";
    case "cancelled":
    case "cancelado":
      return "close-circle-outline";
    default:
      return "ellipse-outline";
  }
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
    case "pendiente":
      return "#F59E0B";
    case "processing":
    case "preparando":
      return "#3B82F6";
    case "shipped":
    case "despachado":
      return "#8B5CF6";
    case "delivered":
    case "entregado":
      return "#10B981";
    case "cancelled":
    case "cancelado":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};
