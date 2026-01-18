"use client";

import { StyleSheet, View } from "react-native";
import { useState } from "react";
import TabBarButton from "./TabBarButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState({
    width: 100,
    height: 20,
  });

  const buttonWidth = dimensions.width / state.routes.length;
  const tabPositionX = useSharedValue(state.index * buttonWidth);

  const onTabbarLayout = (e) => {
    const newWidth = e.nativeEvent.layout.width;
    setDimensions({
      width: newWidth,
      height: e.nativeEvent.layout.height,
    });
    // Actualizar posición inicial del indicador
    tabPositionX.value = state.index * (newWidth / state.routes.length);
  };

  // Estilo animado para el indicador
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View onLayout={onTabbarLayout} style={styles.tabbar}>
        {/* Indicador animado del tab activo */}
        <Animated.View
          pointerEvents="none"
          style={[
            indicatorStyle,
            styles.indicator,
            {
              width: buttonWidth,
            },
          ]}
        >
          <View style={styles.indicatorPill} />
        </Animated.View>

        {/* Botones del tab */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {
              damping: 20,
              stiffness: 180,
              mass: 0.8,
            });

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              label={label}
              accessibilityLabel={`Ir a ${label}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    position: "relative",
    paddingTop: 8,
    paddingBottom: 4,
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  indicatorPill: {
    width: 32,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
});
