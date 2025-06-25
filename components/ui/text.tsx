import { cn } from "@/lib/utils";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

const textVariants = {
  default: "text-base text-foreground",
  large: "text-lg text-foreground",
  small: "text-sm text-foreground",
  muted: "text-sm text-foreground/70",
  title: "text-xl font-semibold text-foreground",
  subtitle: "text-lg font-medium text-foreground",
  caption: "text-xs text-foreground/60",
  error: "text-sm text-red-500",
};

type TextVariant = keyof typeof textVariants;

function Text({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<RNText>;
  asChild?: boolean;
  variant?: TextVariant;
}) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        "web:select-text",
        textVariants[variant],
        textClass,
        className
      )}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants, type TextVariant };
