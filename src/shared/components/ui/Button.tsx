import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "whatsapp"
  | "location"
  | "ghost"
  | "outline";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  iconColor?: string;
  pressedOpacity?: number;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
}

export default function Button({
  onPress,
  icon,
  iconPosition = "left",
  text,
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  loading = false,
  children,
  className = "",
  textClassName = "",
  iconColor,
  pressedOpacity = 0.8,
  fullWidth = false,
  hapticFeedback = true,
  accessibilityLabel,
}: ButtonProps) {
  // Tamaños con áreas táctiles accesibles (mínimo 48px)
  const getSizeStyles = (size: ButtonSize) => {
    const sizes = {
      sm: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        minHeight: 44,
      },
      md: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        minHeight: 52,
      },
      lg: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 14,
        minHeight: 60,
      },
    };
    return sizes[size];
  };

  const getTextSize = (size: ButtonSize) => {
    const textSizes = { sm: 14, md: 16, lg: 18 };
    return textSizes[size];
  };

  const getIconSize = (size: ButtonSize) => {
    const iconSizes = { sm: 18, md: 20, lg: 22 };
    return iconSizes[size];
  };

  const variants = {
    primary: { bg: "#3B82F6", border: "#3B82F6", text: "#FFFFFF" },
    secondary: { bg: "#F3F4F6", border: "#F3F4F6", text: "#374151" },
    success: { bg: "#10B981", border: "#10B981", text: "#FFFFFF" },
    danger: { bg: "#EF4444", border: "#EF4444", text: "#FFFFFF" },
    warning: { bg: "#F59E0B", border: "#F59E0B", text: "#FFFFFF" },
    info: { bg: "#06B6D4", border: "#06B6D4", text: "#FFFFFF" },
    whatsapp: { bg: "#25D366", border: "#25D366", text: "#FFFFFF" },
    location: { bg: "#F97316", border: "#F97316", text: "#FFFFFF" },
    ghost: { bg: "transparent", border: "transparent", text: "#3B82F6" },
    outline: { bg: "transparent", border: "#3B82F6", text: "#3B82F6" },
  };

  const variantStyle = variants[variant];
  const sizeStyle = getSizeStyles(size);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (hapticFeedback && !isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return variantStyle.text;
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={variantStyle.text} />;
    }

    if (children) {
      return children;
    }

    const iconElement = icon && (
      <Ionicons
        name={icon}
        size={getIconSize(size)}
        color={getIconColor()}
        style={{
          marginRight: iconPosition === "left" && text ? 8 : 0,
          marginLeft: iconPosition === "right" && text ? 8 : 0,
        }}
      />
    );

    const textElement = text && (
      <Text
        style={{
          fontSize: getTextSize(size),
          fontWeight: "600",
          color: variantStyle.text,
        }}
      >
        {text}
      </Text>
    );

    if (iconPosition === "right") {
      return (
        <>
          {textElement}
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        {textElement}
      </>
    );
  };

  const buttonStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: variantStyle.bg,
    borderWidth: variant === "outline" ? 2 : 0,
    borderColor: variantStyle.border,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? ("100%" as const) : undefined,
    ...sizeStyle,
  };

  const button = (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={pressedOpacity}
      style={buttonStyle}
      accessibilityLabel={accessibilityLabel || text}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {renderContent()}
    </TouchableOpacity>
  );

  return href ? (
    <Link href={href} asChild>
      {button}
    </Link>
  ) : (
    button
  );
}
