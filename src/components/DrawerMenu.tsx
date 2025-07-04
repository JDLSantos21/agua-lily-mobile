// components/DrawerMenu.tsx
import React, { forwardRef, useImperativeHandle, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  Settings,
  User,
  LogOut,
  Package,
  Bell,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8; // 80% del ancho de pantalla
const VELOCITY_THRESHOLD = 300;
const POSITION_THRESHOLD = DRAWER_WIDTH * 0.3;

interface DrawerMenuProps {
  children: React.ReactNode;
  onMenuItemPress?: (item: string) => void;
}

export interface DrawerMenuRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const menuItems = [
  { id: "home", label: "Inicio", icon: Home, route: "/" },
  { id: "orders", label: "Pedidos", icon: Package, route: "/orders" },
  { id: "profile", label: "Perfil", icon: User, route: "/profile" },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    route: "/settings",
  },
  {
    id: "notifications",
    label: "Notificaciones",
    icon: Bell,
    route: "/notifications",
  },
  { id: "help", label: "Ayuda", icon: HelpCircle, route: "/help" },
];

const DrawerMenu = forwardRef<DrawerMenuRef, DrawerMenuProps>(
  ({ children, onMenuItemPress }, ref) => {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(-DRAWER_WIDTH);
    const backdropOpacity = useSharedValue(0);

    const openDrawer = useCallback(() => {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      backdropOpacity.value = withSpring(0.5);
    }, [translateX, backdropOpacity]);

    const closeDrawer = useCallback(() => {
      translateX.value = withSpring(-DRAWER_WIDTH, {
        damping: 20,
        stiffness: 90,
      });
      backdropOpacity.value = withSpring(0);
    }, [translateX, backdropOpacity]);

    const toggleDrawer = useCallback(() => {
      const isOpen = translateX.value > -DRAWER_WIDTH / 2;
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }, [closeDrawer, openDrawer, translateX.value]);

    useImperativeHandle(ref, () => ({
      open: openDrawer,
      close: closeDrawer,
      toggle: toggleDrawer,
    }));

    const handleMenuItemPress = useCallback(
      (item: string) => {
        closeDrawer();
        onMenuItemPress?.(item);
      },
      [onMenuItemPress, closeDrawer]
    );

    // Gesto para abrir el drawer desde el borde izquierdo
    const edgePanGesture = Gesture.Pan()
      .activeOffsetX([0, 50]) // Solo desde el borde izquierdo
      .failOffsetY([-10, 10])
      .onUpdate((event) => {
        if (event.translationX > 0) {
          const progress = Math.min(event.translationX / DRAWER_WIDTH, 1);
          translateX.value = -DRAWER_WIDTH + progress * DRAWER_WIDTH;
          backdropOpacity.value = progress * 0.5;
        }
      })
      .onEnd((event) => {
        const shouldOpen =
          event.velocityX > VELOCITY_THRESHOLD ||
          event.translationX > POSITION_THRESHOLD;

        if (shouldOpen) {
          runOnJS(openDrawer)();
        } else {
          runOnJS(closeDrawer)();
        }
      });

    // Gesto para cerrar el drawer cuando está abierto
    const drawerPanGesture = Gesture.Pan()
      .activeOffsetX([-50, 0]) // Solo hacia la izquierda cuando está abierto
      .onUpdate((event) => {
        if (event.translationX < 0 && translateX.value > -DRAWER_WIDTH) {
          const newTranslateX = Math.max(-DRAWER_WIDTH, event.translationX);
          translateX.value = newTranslateX;

          const progress = interpolate(
            translateX.value,
            [-DRAWER_WIDTH, 0],
            [0, 1],
            Extrapolation.CLAMP
          );
          backdropOpacity.value = progress * 0.5;
        }
      })
      .onEnd((event) => {
        const shouldClose =
          event.velocityX < -VELOCITY_THRESHOLD ||
          translateX.value < -POSITION_THRESHOLD;

        if (shouldClose) {
          runOnJS(closeDrawer)();
        } else {
          runOnJS(openDrawer)();
        }
      });

    const tapGesture = Gesture.Tap().onEnd(() => {
      runOnJS(closeDrawer)();
    });

    const drawerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
      pointerEvents: backdropOpacity.value > 0 ? "auto" : "none",
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        translateX.value,
        [-DRAWER_WIDTH, 0],
        [1, 0.95],
        Extrapolation.CLAMP
      );

      const translateXContent = interpolate(
        translateX.value,
        [-DRAWER_WIDTH, 0],
        [0, DRAWER_WIDTH * 0.2],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX: translateXContent }, { scale }] as const,
      };
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

        {/* Área para detectar gestos desde el borde izquierdo */}
        <GestureDetector gesture={edgePanGesture}>
          <View style={styles.edgeDetector} />
        </GestureDetector>

        {/* Contenido principal */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {children}
        </Animated.View>

        {/* Backdrop - solo visible cuando backdrop tiene opacidad */}
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        </GestureDetector>

        {/* Drawer */}
        <GestureDetector gesture={drawerPanGesture}>
          <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
            <SafeAreaView style={styles.drawerContent}>
              {/* Header del drawer */}
              <View style={[styles.drawerHeader, { paddingTop: insets.top }]}>
                <View style={styles.profileSection}>
                  <View style={styles.avatar}>
                    <User size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.userName}>Juan Pérez</Text>
                    <Text style={styles.userEmail}>juan@ejemplo.com</Text>
                  </View>
                </View>
              </View>

              {/* Elementos del menú */}
              <View style={styles.menuSection}>
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleMenuItemPress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemContent}>
                        <IconComponent size={24} color="#9CA3AF" />
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>
                      <ChevronRight size={20} color="#6B7280" />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={styles.drawerFooter}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => handleMenuItemPress("logout")}
                  activeOpacity={0.7}
                >
                  <LogOut size={24} color="#EF4444" />
                  <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

DrawerMenu.displayName = "DrawerMenu";

export default DrawerMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  edgeDetector: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: "100%",
    zIndex: 3,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#1F2937",
    zIndex: 2,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: "#E5E7EB",
    marginLeft: 16,
    fontWeight: "500",
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    marginLeft: 16,
    fontWeight: "500",
  },
});
