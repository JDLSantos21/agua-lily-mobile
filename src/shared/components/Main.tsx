import { FlatList, View, Text, RefreshControl } from "react-native";
import { AnimatedOrderCard } from "../../features/orders/components/OrderCard";
// import ScreenLayout from "@/shared/components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/shared/components/Loading";
import OrdersError from "@/features/orders/components/OrdersError";
import { useOrdersWithNotifications } from "@/features/orders/hooks/useOrdersWithNotifications";
import { authStore } from "@/store/auth.store";

export default function Main() {
  const user = authStore.getState().user;
  const userId = user?.id;

  const {
    data: orders,
    isLoading,
    refetch,
    isError,
  } = useOrdersWithNotifications({ driverId: userId });

  const orderCount = orders?.data?.length || 0;

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Obtener primer nombre
  const getFirstName = () => {
    if (!user?.name) return "";
    return user.name.split(" ")[0];
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 12, paddingTop: 20, paddingBottom: 12 }}>
      {/* Saludo y contador en línea */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: "#9CA3AF" }}>{getGreeting()}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "baseline", marginTop: 4 }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {getFirstName()}
          </Text>
          <Text style={{ fontSize: 24, marginLeft: 4 }}>👋</Text>
        </View>
      </View>

      {/* Contador minimalista */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <Text style={{ fontSize: 15, color: "#6B7280" }}>
          Pedidos asignados
        </Text>
        <View
          style={{
            backgroundColor: orderCount > 0 ? "#DBEAFE" : "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: orderCount > 0 ? "#1D4ED8" : "#9CA3AF",
            }}
          >
            {orderCount}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "#F3F4F6",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Ionicons name="cube-outline" size={44} color="#9CA3AF" />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          color: "#111827",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No tienes pedidos
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 24,
        }}
      >
        Los nuevos pedidos aparecerán aquí cuando te sean asignados
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {isLoading && !isError ? (
        <Loading
          title="Cargando pedidos"
          message="Esto solo tomará un momento..."
        />
      ) : isError ? (
        <OrdersError refetch={refetch} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders?.data || []}
          keyExtractor={(order) => order.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => (
            <View style={{ paddingHorizontal: 12 }}>
              <AnimatedOrderCard order={item} index={index} />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}
