import * as Accordion from "@rn-primitives/accordion";
import { ChevronDown } from "lucide-react-native";
import * as React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AccordionRoot = React.forwardRef<
  React.ElementRef<typeof Accordion.Root>,
  React.ComponentPropsWithoutRef<typeof Accordion.Root>
>(({ style, ...props }, ref) => (
  <Accordion.Root ref={ref} style={[{ width: "100%" }, style]} {...props} />
));
AccordionRoot.displayName = "AccordionRoot";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof Accordion.Item>,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ style, ...props }, ref) => (
  <Accordion.Item ref={ref} style={style} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger> & {
    style?: any;
  }
>(({ style, children, ...props }, ref) => {
  const rotation = useSharedValue(0);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  React.useEffect(() => {
    // Listen for accordion state changes
    const handlePress = () => {
      rotation.value = withSpring(rotation.value === 0 ? 90 : 0, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });
    };

    return () => {
      // Cleanup if needed
    };
  }, [rotation]);

  return (
    <Accordion.Trigger
      ref={ref}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        },
        style,
      ]}
      onPress={() => {
        rotation.value = withSpring(rotation.value === 0 ? 90 : 0, {
          damping: 15,
          stiffness: 150,
          mass: 1,
        });
      }}
      {...props}
    >
      {children}
      <Animated.View style={animatedChevronStyle}>
        <ChevronDown size={16} color="#666" />
      </Animated.View>
    </Accordion.Trigger>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content> & {
    style?: any;
  }
>(({ style, children, ...props }, ref) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
      overflow: "hidden",
    };
  });

  const animateIn = () => {
    height.value = withSpring(200, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
    opacity.value = withTiming(1, {
      duration: 300,
    });
  };

  const animateOut = () => {
    height.value = withSpring(0, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
    opacity.value = withTiming(0, {
      duration: 200,
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isOpen]);

  return (
    <Accordion.Content
      ref={ref}
      onLayout={(event) => {
        // Auto-detect content height for better animations
        const { height: contentHeight } = event.nativeEvent.layout;
        if (contentHeight > 0 && isOpen) {
          height.value = withSpring(contentHeight, {
            damping: 20,
            stiffness: 150,
            mass: 1,
          });
        }
      }}
      style={[animatedStyle, style]}
      {...props}
    >
      <Animated.View
        style={{
          opacity: opacity,
        }}
      >
        {children}
      </Animated.View>
    </Accordion.Content>
  );
});
AccordionContent.displayName = "AccordionContent";

export { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger };
