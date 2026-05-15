// Aura "Windy Beach" Design System

export const COLORS = {
  // Primary palette
  background: "#F5F5F2",    // Soft Sand
  card: "#FFFFFF",          // White
  cardBorder: "#FFFFFF",    // White
  primary: "#81D4FA",       // Light Sky Blue
  text: "#37474F",          // Wet Slate
  accent: "#FFA726",        // Sunlight Orange

  // Semantic colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",

  // Transparency
  cardOverlay: "rgba(255, 255, 255, 0.8)", // Frosted Sea Glass
};

export const BORDER_RADIUS = {
  glass: 40,   // Card container
  pebble: 32,  // History card
  button: 12,
  small: 8,
};

export const TYPOGRAPHY = {
  family: {
    sans: "System",
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  weight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};
