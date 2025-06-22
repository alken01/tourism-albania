import { PropsWithChildren, useState } from "react";
import { TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemedStyles } from "@/hooks/useThemedStyles";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, Spacing } = useThemedStyles();

  const componentStyles = {
    heading: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: Spacing.sm - 2,
    },
    content: {
      marginTop: Spacing.sm - 2,
      marginLeft: Spacing.xxl,
    },
  };

  return (
    <ThemedView>
      <TouchableOpacity
        style={componentStyles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={colors.icon}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView style={componentStyles.content}>{children}</ThemedView>
      )}
    </ThemedView>
  );
}
