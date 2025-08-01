// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// ➜ Añadimos .mjs y .cjs si aún no existen
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "mjs", "cjs"]),
];

module.exports = wrapWithReanimatedMetroConfig(config);

module.exports = withNativeWind(config, { input: "./global.css" });
