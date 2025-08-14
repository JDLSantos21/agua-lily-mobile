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

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({
    width: 100,
    height: 20,
  });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View style={[styles.container]}>
      <View onLayout={onTabbarLayout} style={styles.tabbar}>
        {/* Indicador animado */}
        <Animated.View
          pointerEvents="none"
          style={[
            animatedStyle,
            styles.indicator,
            {
              width: buttonWidth * 0.6,
              left: buttonWidth * 0.2,
            },
          ]}
        />

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
              stiffness: 200,
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
              color={isFocused ? "#3B82F6" : "#9CA3AF"}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 0.8,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  indicator: {
    position: "absolute",
    height: 3,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
    top: 8,
  },
});
