export const getEquipmentStatusBadgeBg = (status: string) => {
  switch (status) {
    case "disponible":
      return "bg-green-100 color-green-500";
    case "mantenimiento":
      return "bg-yellow-100 color-orange-800";
    case "asignado":
      return "bg-blue-100 color-blue-500";
    case "inhabilitado":
      return "bg-red-100 color-red-500";
    default:
      return "bg-gray-100 color-gray-500";
  }
};

export const getEquipmentStatusBadgeColor = (status: string) => {
  switch (status) {
    case "disponible":
      return "color-green-500";
    case "mantenimiento":
      return "color-yellow-500";
    case "asignado":
      return "color-blue-500";
    case "inhabilitado":
      return "color-red-500";
    default:
      return "color-gray-500";
  }
};
