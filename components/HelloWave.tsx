import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";

export function HelloWave() {
  const { Typography } = useThemedStyles();
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      4 // Run the animation 4 times
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  const waveStyle = {
    fontSize: Typography.sizes.xxxl,
    lineHeight: Typography.sizes.huge,
    marginTop: -6,
  };

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={waveStyle}>👋</ThemedText>
    </Animated.View>
  );
}
