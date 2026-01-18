import { Pressable, StyleSheet } from "react-native";
import { icon } from "@/shared/contants/tabbar/icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

import type {
  GestureResponderEvent,
  AccessibilityRole,
  AccessibilityState,
} from "react-native";

interface TabBarButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: string;
  label: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
}

export default function TabBarButton({
  routeName,
  onPress,
  onLongPress,
  isFocused,
  label,
  accessibilityLabel,
  accessibilityRole = "tab",
  accessibilityState,
}: TabBarButtonProps) {
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isFocused, scale]);

  // Animación del icono
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  // Animación del label - siempre visible pero cambia de opacidad
  const animatedLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0.6, 1]);
    return {
      opacity,
    };
  });

  const handlePress = (event: GestureResponderEvent) => {
    // Haptic feedback sutil al cambiar de tab
    if (!isFocused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(event);
  };

  const AnimatedView = Animated.View as any;
  const AnimatedText = Animated.Text as any;

  // Colores accesibles con buen contraste
  const activeColor = "#2563EB"; // primary-600
  const inactiveColor = "#6B7280"; // gray-500

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
      accessibilityLabel={accessibilityLabel || `Ir a ${label}`}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {/* Icono */}
      <AnimatedView style={[styles.iconContainer, animatedIconStyle]}>
        {icon[routeName]({
          color: isFocused ? activeColor : inactiveColor,
          size: 24, // Iconos más grandes para accesibilidad
        })}
      </AnimatedView>

      {/* Label - siempre visible para accesibilidad */}
      <AnimatedText
        style={[
          styles.label,
          { color: isFocused ? activeColor : inactiveColor },
          animatedLabelStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </AnimatedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 56, // Mínimo 48px + padding para accesibilidad
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
