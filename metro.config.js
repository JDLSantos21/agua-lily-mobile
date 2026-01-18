const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// Añadimos extensiones necesarias
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "mjs", "cjs"]),
];

// Encadenamos las configuraciones: primero NativeWind y luego Reanimated
const configWithNativeWind = withNativeWind(config, { input: "./global.css" });

module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
