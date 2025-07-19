import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

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
  pressedOpacity = 0.7,
  fullWidth = false,
}: ButtonProps) {
  const getSizeClasses = (size: ButtonSize) => {
    const sizes = {
      sm: "py-2 px-3 rounded-lg",
      md: "py-4 px-4 rounded-2xl",
      lg: "py-6 px-6 rounded-2xl",
    };
    return sizes[size];
  };

  const getTextSizeClasses = (size: ButtonSize) => {
    const textSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    return textSizes[size];
  };

  const getIconSize = (size: ButtonSize) => {
    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 20,
    };
    return iconSizes[size];
  };

  const baseClasses = `flex-row items-center justify-center ${getSizeClasses(size)} ${fullWidth ? "w-full" : ""} ${className}`;

  const variants = {
    primary: "bg-blue-500 border-blue-500",
    secondary: "bg-gray-100 border-gray-100",
    success: "bg-green-600 border-green-500",
    danger: "bg-red-500 border-red-500",
    warning: "bg-yellow-500 border-yellow-500",
    info: "bg-cyan-500 border-cyan-500",
    whatsapp: "bg-green-500 border-green-600",
    location: "bg-orange-500 border-orange-500",
    ghost: "bg-transparent border-transparent",
    outline: "bg-transparent border-2 border-blue-500",
  };

  const textVariants = {
    primary: "text-white font-medium",
    secondary: "text-gray-700 font-medium",
    success: "text-white font-medium",
    danger: "text-white font-medium",
    warning: "text-white font-medium",
    info: "text-white font-medium",
    whatsapp: "text-white font-medium",
    location: "text-white font-medium",
    ghost: "text-blue-500 font-medium",
    outline: "text-blue-500 font-medium",
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;

    const iconColors = {
      primary: "white",
      secondary: "#374151",
      success: "white",
      danger: "white",
      warning: "white",
      info: "white",
      whatsapp: "white",
      location: "white",
      ghost: "#3B82F6",
      outline: "#3B82F6",
    };
    return iconColors[variant];
  };

  const isDisabled = disabled || loading;
  const currentOpacity = isDisabled ? 0.5 : 1;

  const renderContent = () => {
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
        className={`${getTextSizeClasses(size)} ${textVariants[variant]} ${textClassName}`}
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

  const button = (
    <TouchableOpacity
      onPress={onPress}
      className={`${baseClasses} ${variants[variant]} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      activeOpacity={pressedOpacity}
      style={{
        opacity: currentOpacity,
        transform: [{ scale: 1 }],
      }}
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
