import { StyleSheet } from "react-native";

// Colors
export const AppColors = {
  light: {
    // Primary colors
    primary: "#4A90E2",
    primaryDark: "#2E7D32",
    primaryLight: "#81C784",

    // Secondary colors
    secondary: "#0a7ea4",
    secondaryDark: "#064e63",
    secondaryLight: "#4db6d9",

    // Background colors
    background: "#fff",
    backgroundSecondary: "#f5f5f5",
    backgroundTertiary: "#e8f5e8",

    // Text colors
    text: "#11181C",
    textSecondary: "#666",
    textMuted: "#999",
    textLight: "#fff",

    // Status colors
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800",
    info: "#2196F3",

    // UI colors
    border: "#E0E0E0",
    borderLight: "#F0F0F0",
    borderDark: "#BDBDBD",
    shadow: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Icon colors
    icon: "#687076",
    iconActive: "#4CAF50",
    iconInactive: "#9E9E9E",

    // Placeholder colors
    blue: "#4A90E2",
    green: "#7ED321",
    yellow: "#F5A623",
    red: "#D0021B",
    purple: "#9013FE",
    orange: "#F8A51D",
    pink: "#BD10E0",
  },
  dark: {
    // Primary colors
    primary: "#66BB6A",
    primaryDark: "#2E7D32",
    primaryLight: "#81C784",

    // Secondary colors
    secondary: "#4db6d9",
    secondaryDark: "#064e63",
    secondaryLight: "#87ceeb",

    // Background colors
    background: "#151718",
    backgroundSecondary: "#1e1e1e",
    backgroundTertiary: "#2a2a2a",

    // Text colors
    text: "#ECEDEE",
    textSecondary: "#B0B0B0",
    textMuted: "#888",
    textLight: "#fff",

    // Status colors
    success: "#66BB6A",
    error: "#EF5350",
    warning: "#FFA726",
    info: "#42A5F5",

    // UI colors
    border: "#333",
    borderLight: "#444",
    borderDark: "#222",
    shadow: "rgba(0, 0, 0, 0.3)",
    overlay: "rgba(0, 0, 0, 0.7)",

    // Icon colors
    icon: "#9BA1A6",
    iconActive: "#66BB6A",
    iconInactive: "#666",

    // Placeholder colors
    blue: "#2D5A8B",
    green: "#4A7C59",
    yellow: "#B8941A",
    red: "#8B2D2D",
    purple: "#5A2D8B",
    orange: "#B85A1A",
    pink: "#8B2D5A",
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// Typography
export const Typography = {
  sizes: {
    xxxxs: 8,
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
    massive: 36,
  },
  weights: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Border radius
export const BorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// Blur radius
export const BlurRadius = {
  sm: 24,
  md: 48,
  lg: 96,
  xl: 192,
  xxl: 384,
  full: 9999,
};

// Border width
export const BorderWidth = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

// Shadows
export const Shadows = {
  light: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  dark: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

// Global Styles
export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: Spacing.lg,
  },

  // Section styles
  sectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.md,
  },

  // Card styles
  card: {
    backgroundColor: "transparent", // Will be set dynamically
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardShadow: {
    // Shadow will be applied dynamically based on theme
  },

  // Grid styles
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: Spacing.md,
  },
  gridItemThird: {
    width: "32%",
    marginBottom: Spacing.md,
  },

  // Button styles
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },

  // Filter styles
  filterContainer: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  filterTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  filterList: {
    paddingHorizontal: Spacing.xs,
  },
  filterItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    fontSize: Typography.sizes.sm,
    textAlign: "center",
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.md,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  errorText: {
    textAlign: "center",
    fontSize: Typography.sizes.md,
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.huge,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: Typography.sizes.md,
  },

  // List styles
  listContainer: {
    paddingVertical: Spacing.sm,
  },
  listItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },

  // Group styles (for grouped lists)
  groupContainer: {
    marginBottom: Spacing.lg,
    // paddingHorizontal: Spacing.lg,
  },
  groupTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },

  // Text styles
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
  },
  body: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.sizes.md * Typography.lineHeights.normal,
  },
  caption: {
    fontSize: Typography.sizes.sm,
    opacity: 0.7,
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.md,
  },

  // Utility styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Margin utilities
  mt: { marginTop: Spacing.md },
  mb: { marginBottom: Spacing.md },
  ml: { marginLeft: Spacing.md },
  mr: { marginRight: Spacing.md },
  mx: { marginHorizontal: Spacing.md },
  my: { marginVertical: Spacing.md },

  // Padding utilities
  pt: { paddingTop: Spacing.md },
  pb: { paddingBottom: Spacing.md },
  pl: { paddingLeft: Spacing.md },
  pr: { paddingRight: Spacing.md },
  px: { paddingHorizontal: Spacing.md },
  py: { paddingVertical: Spacing.md },
});

// Helper function to get themed colors
export const getThemedColors = (isDark: boolean) => {
  return isDark ? AppColors.dark : AppColors.light;
};

// Helper function to get themed shadows
export const getThemedShadows = (isDark: boolean) => {
  return isDark ? Shadows.dark : Shadows.light;
};

// Helper function to create themed styles
export const createThemedStyles = (isDark: boolean) => {
  const colors = getThemedColors(isDark);
  const shadows = getThemedShadows(isDark);

  return StyleSheet.create({
    // Background styles
    background: {
      backgroundColor: colors.background,
    },
    backgroundSecondary: {
      backgroundColor: colors.backgroundSecondary,
    },

    // Text styles
    text: {
      color: colors.text,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    textMuted: {
      color: colors.textMuted,
    },

    // Button styles
    buttonPrimary: {
      backgroundColor: colors.primary,
    },
    buttonSecondary: {
      backgroundColor: colors.secondary,
    },
    buttonOutline: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: "transparent",
    },

    // Card styles
    card: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.md,
    },

    // Filter styles
    filterItem: {
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
    },
    filterItemActive: {
      backgroundColor: colors.primary,
      color: colors.textLight,
    },

    // Error styles
    errorText: {
      color: colors.error,
    },

    // Input styles
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
  });
};
