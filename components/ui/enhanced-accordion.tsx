import { ChevronDown } from "lucide-react-native";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface EnhancedAccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: any;
  isLastItem?: boolean;
}

export function EnhancedAccordionItem({
  title,
  children,
  style,
  isLastItem = false,
}: EnhancedAccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(0);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
      overflow: "hidden",
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleAccordion = () => {
    if (isOpen) {
      // Closing animation
      height.value = withSpring(0, {
        damping: 18,
        stiffness: 120,
        mass: 0.8,
      });
      opacity.value = withTiming(0, { duration: 200 });
      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });
      runOnJS(setIsOpen)(false);
    } else {
      // Opening animation
      runOnJS(setIsOpen)(true);
      height.value = withSpring(contentHeight, {
        damping: 18,
        stiffness: 120,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withSpring(90, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });
    }
  };

  const handleContentLayout = (event: any) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    if (measuredHeight > 0 && contentHeight === 0) {
      setContentHeight(measuredHeight);
    }
  };

  return (
    <View
      style={[
        {
          borderBottomWidth: isLastItem ? 0 : 1,
          borderBottomColor: "#E5E5E5",
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>{title}</View>
        <Animated.View style={[animatedChevronStyle, { marginLeft: 8 }]}>
          <ChevronDown size={16} color="#666" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={animatedContentStyle}>
        <View
          onLayout={handleContentLayout}
          style={{
            position: contentHeight === 0 ? "absolute" : "relative",
            opacity: contentHeight === 0 ? 0 : 1,
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

interface EnhancedAccordionProps {
  children: React.ReactNode;
  style?: any;
}

export function EnhancedAccordion({ children, style }: EnhancedAccordionProps) {
  return <View style={style}>{children}</View>;
}
