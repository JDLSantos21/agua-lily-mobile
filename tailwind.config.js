/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores principales
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        // Superficies
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F9FAFB",
          elevated: "#FFFFFF",
        },
        // Texto con buen contraste
        content: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        // Estados de pedido
        status: {
          pending: "#F59E0B",
          preparing: "#3B82F6",
          dispatched: "#8B5CF6",
          delivered: "#10B981",
          cancelled: "#EF4444",
        },
      },
      // Espaciado para accesibilidad
      spacing: {
        touch: "48px",
        "touch-sm": "44px",
      },
      // Border radius consistente
      borderRadius: {
        card: "16px",
        button: "12px",
        badge: "8px",
      },
      // Tamaños de fuente accesibles
      fontSize: {
        "xs-acc": ["13px", { lineHeight: "18px" }],
        "sm-acc": ["14px", { lineHeight: "20px" }],
        "base-acc": ["16px", { lineHeight: "24px" }],
        "lg-acc": ["18px", { lineHeight: "28px" }],
        "xl-acc": ["20px", { lineHeight: "28px" }],
        "2xl-acc": ["24px", { lineHeight: "32px" }],
      },
    },
  },
  plugins: [],
};
