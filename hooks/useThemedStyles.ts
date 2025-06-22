import {
  BorderRadius,
  createThemedStyles,
  getThemedColors,
  getThemedShadows,
  GlobalStyles,
  Spacing,
  Typography,
} from "@/constants/GlobalStyles";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

export const useThemedStyles = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themedStyles = useMemo(() => {
    return createThemedStyles(isDark);
  }, [isDark]);

  const colors = useMemo(() => {
    return getThemedColors(isDark);
  }, [isDark]);

  const shadows = useMemo(() => {
    return getThemedShadows(isDark);
  }, [isDark]);

  return {
    // Themed styles
    themedStyles,
    colors,
    shadows,

    // Global constants
    GlobalStyles,
    Spacing,
    Typography,
    BorderRadius,

    // Theme info
    isDark,
    colorScheme,
  };
};

// Export individual hooks for specific use cases
export const useThemedColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return useMemo(() => {
    return getThemedColors(isDark);
  }, [isDark]);
};

export const useThemedShadows = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return useMemo(() => {
    return getThemedShadows(isDark);
  }, [isDark]);
};
