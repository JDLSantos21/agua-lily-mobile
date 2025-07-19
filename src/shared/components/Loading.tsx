import { ActivityIndicator, Text, View, Modal } from "react-native";
import { ReactNode } from "react";

type LoadingVariant = "fullscreen" | "modal" | "inline" | "overlay";

type LoadingProps = {
  title?: string;
  message?: string;
  color?: string;
  size?: "small" | "large";
  className?: string;
  variant?: LoadingVariant;
  visible?: boolean;
  onRequestClose?: () => void;
  children?: ReactNode;
  containerStyle?: string;
  textStyle?: string;
  backdropOpacity?: number;
  animationType?: "none" | "slide" | "fade";
  theme?: "light" | "dark";
  showProgress?: boolean;
};

export default function Loading({
  title = "Cargando",
  message,
  color = "#6366F1",
  size = "large",
  className = "",
  variant = "inline",
  visible = true,
  onRequestClose,
  children,
  containerStyle,
  textStyle,
  backdropOpacity = 0.8,
  animationType = "fade",
  theme = "light",
  showProgress = true,
}: LoadingProps) {
  const getVariantStyles = () => {
    const isDark = theme === "dark";
    const bgColor = isDark ? "bg-gray-900" : "bg-white";
    // const textColor = isDark ? "text-white" : "text-gray-800";
    // const secondaryTextColor = isDark ? "text-gray-300" : "text-gray-600";

    switch (variant) {
      case "fullscreen":
        return {
          container: `absolute inset-0 items-center justify-center ${bgColor} z-50`,
          content: "items-center justify-center px-8",
          cardStyle: "",
        };
      case "modal":
        return {
          container: `items-center justify-center ${bgColor} rounded-2xl p-8 mx-6 shadow-2xl border border-gray-100`,
          content: "items-center justify-center",
          cardStyle: "shadow-2xl",
        };
      case "overlay":
        return {
          container: "absolute inset-0 items-center justify-center z-40",
          content: `items-center justify-center ${bgColor} rounded-2xl p-8 mx-6 shadow-2xl border border-gray-100`,
          cardStyle: "shadow-2xl",
        };
      case "inline":
      default:
        return {
          container: "items-center justify-center flex-1",
          content: "items-center justify-center px-4",
          cardStyle: "",
        };
    }
  };

  const styles = getVariantStyles();
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDark ? "text-gray-300" : "text-gray-600";

  const renderContent = () => (
    <View className={`${styles.content} ${containerStyle || ""}`}>
      {children || (
        <>
          {/* Loading Spinner Container */}
          <View className="relative mb-6">
            {/* Outer Ring */}
            <View className="absolute w-20 h-20 border-4 border-gray-200 rounded-full" />
            {/* Inner Spinner */}
            <View className="items-center justify-center w-20 h-20">
              <ActivityIndicator size={size} color={color} />
            </View>
          </View>

          {/* Title */}
          <Text
            className={`text-xl font-semibold ${textColor} mb-2 text-center ${textStyle || ""}`}
          >
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text
              className={`text-sm ${secondaryTextColor} text-center max-w-xs leading-5 ${textStyle || ""}`}
            >
              {message}
            </Text>
          )}

          {/* Progress Dots */}
          {showProgress && (
            <View className="flex-row mt-4 space-x-2">
              <View className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
              <View className="w-2 h-2 delay-100 bg-gray-400 rounded-full animate-pulse" />
              <View className="w-2 h-2 delay-200 bg-gray-500 rounded-full animate-pulse" />
            </View>
          )}
        </>
      )}
    </View>
  );

  if (!visible) return null;

  // Para modal y overlay, usar Modal de React Native
  if (variant === "modal" || variant === "overlay") {
    return (
      <Modal
        transparent={true}
        animationType={animationType}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View
          className="items-center justify-center flex-1"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
          }}
        >
          <View className={`${styles.container} ${className}`}>
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }

  // Para fullscreen e inline
  return (
    <View className={`${styles.container} ${className}`}>
      {renderContent()}
    </View>
  );
}
