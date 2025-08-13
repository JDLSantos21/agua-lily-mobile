import { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "b116acb7-d591-454b-8eac-946726569a80";
const PROJECT_SLUG = "agua-lily-mobile";
const OWNER = "jdlsantos";

const APP_NAME = "Agua Lily Mobile";
const BUNDLE_IDENTIFIER = "com.jdlsantos.agualilymobile";
const PACKAGE_NAME = "com.jdlsantos.agualilymobile";
const ICON = "./assets/icons/adaptive_icon.png";
const ADAPTIVE_ICON = "./assets/icons/adaptive_icon.png";
const SCHEME = "agualilymobile";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log(`Building app for ${process.env.APP_ENV} environment`);
  const { name, bundleIdentifier, packageName, icon, adaptiveIcon, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    version: "1.0.0",
    slug: PROJECT_SLUG,
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    ios: {
      supportsTablet: true,
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
      bundleIdentifier: bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        monochromeImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: packageName,
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
    },
    web: {
      bundler: "metro",
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash_icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Esta aplicación necesita acceso a la ubicación para guardar las coordenadas de los clientes.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "Esta aplicación necesita acceso a la cámara para escanear códigos QR.",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/icons/notification_icon.png",
          color: "#ffffff",
        },
      ],
      ["expo-router"],
    ],
    extra: {
      owner: OWNER,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/b116acb7-d591-454b-8eac-946726569a80",
    },
  };
};

export const getDynamicAppConfig = (
  enviroment: "development" | "preview" | "production"
) => {
  if (enviroment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (enviroment === "preview") {
    return {
      name: `${APP_NAME} Prev`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.prev`,
      packageName: `${PACKAGE_NAME}.prev`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: `${SCHEME}-prev`,
    };
  }

  if (enviroment === "development") {
    return {
      name: `${APP_NAME} dev`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
      packageName: `${PACKAGE_NAME}.dev`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: `${SCHEME}-dev`,
    };
  }
};
