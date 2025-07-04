import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { View, Text } from "react-native";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { OrderStatusHistory } from "@/types/orders.types";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";

type OrderStatusBottomSheetProps = {
  orderStatusArray: OrderStatusHistory[];
};

const OrderStatusBottomSheet = forwardRef<
  BottomSheet,
  OrderStatusBottomSheetProps
>(({ orderStatusArray }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Exponer métodos para controlar el bottomsheet desde el componente padre
  useImperativeHandle(ref, () => ({
    // Custom methods
    ...bottomSheetRef.current,
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // -1 significa cerrado por defecto
      snapPoints={["50%"]} // Puedes ajustar el tamaño del bottomsheet
      enablePanDownToClose={true}
      enableDynamicSizing={true}
    >
      <BottomSheetView className="px-4">
        <Text className="mb-4 text-xl font-bold">Historial de Estados</Text>

        {!orderStatusArray || orderStatusArray.length === 0 ? (
          <Text className="text-gray-500">No hay estados disponibles.</Text>
        ) : (
          orderStatusArray.map((status, index) => (
            <View key={index} className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <OrderStatusBadge status={status.status} />
                <Text className="text-xs text-gray-400">
                  {new Date(status.created_at).toLocaleString()}
                </Text>
              </View>
              {status.notes && (
                <Text className="pl-3 text-sm text-gray-600">
                  {status.notes}
                </Text>
              )}
            </View>
          ))
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

OrderStatusBottomSheet.displayName = "OrderStatusBottomSheet";

export default OrderStatusBottomSheet;
