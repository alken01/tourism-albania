import { View, type ViewProps } from "react-native";

import { useThemedColors } from "@/hooks/useThemedStyles";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemedColors();

  // Use provided colors or fallback to theme background
  const backgroundColor =
    lightColor || darkColor ? lightColor || darkColor : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
