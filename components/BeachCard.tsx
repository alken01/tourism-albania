import BeachMapButton from "@/components/BeachMapButton";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BeachCardProps {
  beach: Beach;
  onPress?: (beach: Beach) => void;
  showLocation?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.md) / 1.7;
const CARD_HEIGHT = 300;
const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds (slower)
const FADE_DURATION = 800; // Fade animation duration

export default function BeachCard({
  beach,
  onPress,
  showLocation = true,
}: BeachCardProps) {
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoSlideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnimsRef = useRef<Animated.Value[]>([]);

  const getLocalizedField = useLocalizedField();

  // Initialize fade animations for all images
  useEffect(() => {
    if (beach.photo_urls && beach.photo_urls.length > 1) {
      fadeAnimsRef.current = beach.photo_urls.map(
        (_, index) => new Animated.Value(index === 0 ? 1 : 0)
      );
    }
  }, [beach.photo_urls]);

  // Auto-slide functionality with fade animation
  useEffect(() => {
    const hasMultipleImages = beach.photo_urls && beach.photo_urls.length > 1;

    if (!hasMultipleImages) return;

    const startAutoSlide = () => {
      autoSlideTimerRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % beach.photo_urls!.length;

          // Animate fade out current image and fade in next image
          if (
            fadeAnimsRef.current[prevIndex] &&
            fadeAnimsRef.current[nextIndex]
          ) {
            // Fade out current
            Animated.timing(fadeAnimsRef.current[prevIndex], {
              toValue: 0,
              duration: FADE_DURATION / 2,
              useNativeDriver: true,
            }).start();

            // Fade in next with slight delay for smooth transition
            setTimeout(() => {
              Animated.timing(fadeAnimsRef.current[nextIndex], {
                toValue: 1,
                duration: FADE_DURATION / 2,
                useNativeDriver: true,
              }).start();
            }, FADE_DURATION / 4);
          }

          return nextIndex;
        });
      }, AUTO_SLIDE_INTERVAL);
    };

    startAutoSlide();

    // Cleanup timer on unmount
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [beach.photo_urls]);

  const handlePress = () => {
    // Navigate to beach detail page
    router.push(`/beach/${beach.id}`);
    // Also call the optional onPress callback
    onPress?.(beach);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / CARD_WIDTH);

    if (currentIndex !== currentImageIndex && fadeAnimsRef.current.length > 0) {
      // Manual scroll - update fade animations
      fadeAnimsRef.current.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: index === currentIndex ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }

    setCurrentImageIndex(currentIndex);
  };

  const handleScrollBeginDrag = () => {
    // Pause auto-slide when user manually interacts
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
  };

  const handleScrollEndDrag = () => {
    const hasMultipleImages = beach.photo_urls && beach.photo_urls.length > 1;

    if (!hasMultipleImages) return;

    // Restart auto-slide after user interaction with longer delay
    setTimeout(() => {
      autoSlideTimerRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % beach.photo_urls!.length;

          // Animate fade transitions
          if (
            fadeAnimsRef.current[prevIndex] &&
            fadeAnimsRef.current[nextIndex]
          ) {
            Animated.timing(fadeAnimsRef.current[prevIndex], {
              toValue: 0,
              duration: FADE_DURATION / 2,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              Animated.timing(fadeAnimsRef.current[nextIndex], {
                toValue: 1,
                duration: FADE_DURATION / 2,
                useNativeDriver: true,
              }).start();
            }, FADE_DURATION / 4);
          }

          return nextIndex;
        });
      }, AUTO_SLIDE_INTERVAL);
    }, 2000); // 2 second delay before resuming auto-slide
  };

  const getBeachName = () => {
    const name = beach.name_en;
    return name.replace(/beach|beach of/gi, "").trim();
  };

  const getBeachDescription = () => {
    const description = getLocalizedField(beach, "description");
    return description.length > 80
      ? description.substring(0, 80) + "..."
      : description;
  };

  const hasMultipleImages = beach.photo_urls && beach.photo_urls.length > 1;

  const cardStyles = {
    container: {
      width: CARD_WIDTH,
      marginHorizontal: Spacing.sm,
      marginTop: Spacing.md,
      borderRadius: BorderRadius.xxl,
      overflow: "hidden" as const,
    },
    imageContainer: {
      position: "relative" as const,
      width: "100%" as const,
      height: CARD_HEIGHT,
    },
    carouselContainer: {
      width: "100%" as const,
      height: CARD_HEIGHT,
    },
    imageStack: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    image: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    },
    animatedImage: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    },
    placeholderImage: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      backgroundColor: colors.primary,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    placeholderText: {
      fontSize: 48,
    },
    // Edge blur effects
    leftBlur: {
      position: "absolute" as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: 30,
      zIndex: 5,
    },
    rightBlur: {
      position: "absolute" as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: 30,
      zIndex: 5,
    },
    // Pagination dots
    paginationContainer: {
      position: "absolute" as const,
      top: Spacing.lg,
      left: Spacing.lg,
      flexDirection: "row" as const,
      zIndex: 10,
    },
    paginationDot: {
      width: Spacing.sm,
      height: Spacing.sm,
      borderRadius: BorderRadius.sm,
      marginHorizontal: Spacing.xs,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    paginationDotActive: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      transform: [{ scale: 1.2 }],
    },
    // Linear gradient overlay
    gradientOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "70%" as const,
    },
    contentOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.md,
      paddingTop: Spacing.lg,
    },
    titleContainer: {
      marginBottom: Spacing.xs,
    },
    locationContainer: {
      marginBottom: Spacing.xs,
    },
    locationText: {
      color: "#FFFFFF",
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.medium as any,
      opacity: 0.95,
    },
    description: {
      color: "#FFFFFF",
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.light as any,
      lineHeight: Typography.sizes.md,
      opacity: 0.9,
    },
  };

  const renderImageCarousel = () => {
    if (!beach.photo_urls || beach.photo_urls.length === 0) {
      return (
        <View style={cardStyles.placeholderImage}>
          <Text style={cardStyles.placeholderText}>🏖️</Text>
        </View>
      );
    }

    if (beach.photo_urls.length === 1) {
      // Single image - no need for carousel
      return (
        <Image
          source={{ uri: beach.photo_urls[0] }}
          style={cardStyles.image}
          contentFit="cover"
          transition={200}
        />
      );
    }

    // Multiple images - render stacked carousel with fade animations
    return (
      <View style={cardStyles.carouselContainer}>
        {/* Stacked images with fade animations */}
        <View style={cardStyles.imageStack}>
          {beach.photo_urls.map((photoUrl, index) => (
            <Animated.View
              key={index}
              style={[
                cardStyles.animatedImage,
                {
                  opacity:
                    fadeAnimsRef.current[index] ||
                    new Animated.Value(index === 0 ? 1 : 0),
                },
              ]}
            >
              <Image
                source={{ uri: photoUrl }}
                style={cardStyles.image}
                contentFit="cover"
                transition={200}
              />
            </Animated.View>
          ))}
        </View>

        {/* Invisible ScrollView for manual interaction */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          style={{ opacity: 0 }}
        >
          {beach.photo_urls.map((_, index) => (
            <View
              key={index}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            />
          ))}
        </ScrollView>

        {/* Edge blur effects */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={cardStyles.leftBlur}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={cardStyles.rightBlur}
          pointerEvents="none"
        />
      </View>
    );
  };

  const renderPaginationDots = () => {
    if (!hasMultipleImages) return null;

    return (
      <View style={cardStyles.paginationContainer}>
        {beach.photo_urls?.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              cardStyles.paginationDot,
              index === currentImageIndex && cardStyles.paginationDotActive,
              {
                opacity: fadeAnimsRef.current[index]
                  ? Animated.multiply(
                      fadeAnimsRef.current[index],
                      0.5
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  : index === currentImageIndex
                  ? 1
                  : 0.5,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={cardStyles.container}>
        <View style={cardStyles.imageContainer}>
          {renderImageCarousel()}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.0)", "rgba(0,0,0,1)"]}
            locations={[0, 0.0, 1]}
            style={cardStyles.gradientOverlay}
          />

          {/* Pagination dots positioned at top left */}
          {renderPaginationDots()}

          {/* Map button positioned at top right */}
          <View
            style={{
              position: "absolute",
              top: Spacing.sm,
              right: Spacing.sm,
              zIndex: 10,
            }}
          >
            <BeachMapButton beach={beach} />
          </View>

          <View style={cardStyles.contentOverlay}>
            <View style={cardStyles.titleContainer}>
              <ThemedText type="subtitle" style={{ color: colors.textLight }}>
                {getBeachName()}
              </ThemedText>
            </View>

            {showLocation && (
              <View style={cardStyles.locationContainer}>
                <ThemedText style={cardStyles.locationText}>
                  📍 {beach.municipality.name}
                </ThemedText>
              </View>
            )}

            <ThemedText
              type="defaultLight"
              style={{
                color: colors.textLight,
                lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
              }}
              numberOfLines={3}
            >
              {getBeachDescription()}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
