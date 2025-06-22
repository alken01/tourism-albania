import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const { Typography, colors } = useThemedStyles();

  const getTypeStyle = () => {
    switch (type) {
      case "title":
        return {
          fontSize: Typography.sizes.huge,
          fontWeight: Typography.weights.bold,
          lineHeight: Typography.sizes.huge * Typography.lineHeights.tight,
        };
      case "subtitle":
        return {
          fontSize: Typography.sizes.xl,
          fontWeight: Typography.weights.bold,
          lineHeight: Typography.sizes.xl * Typography.lineHeights.normal,
        };
      case "defaultSemiBold":
        return {
          fontSize: Typography.sizes.md,
          lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
          fontWeight: Typography.weights.semibold,
        };
      case "link":
        return {
          lineHeight: Typography.sizes.md * Typography.lineHeights.loose,
          fontSize: Typography.sizes.md,
          color: colors.secondary,
        };
      case "default":
      default:
        return {
          fontSize: Typography.sizes.md,
          lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
          fontWeight: Typography.weights.regular,
        };
    }
  };

  return <Text style={[{ color }, getTypeStyle(), style]} {...rest} />;
}
