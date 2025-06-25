import BeachMapButton from "@/components/BeachMapButton";
import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent } from "@/components/ui/card";
import { BorderWidth, Spacing } from "@/constants/GlobalStyles";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
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
const IMAGE_HEIGHT = 200;
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
    // Navigate to beach detail modal
    router.push(`/beach-detail?id=${beach.id}`);
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
    const cleanName = name.replace(/beach|beach of/gi, "").trim();
    // Convert to title case
    return cleanName.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const getBeachDescription = () => {
    const description = getLocalizedField(beach, "description");
    return description.length > 80
      ? description.substring(0, 80) + "..."
      : description;
  };

  const hasMultipleImages = beach.photo_urls && beach.photo_urls.length > 1;

  const styles = {
    container: {
      width: CARD_WIDTH,
      marginHorizontal: Spacing.sm,
      marginTop: Spacing.md,
      borderWidth: BorderWidth.xs,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
    },
    imageContainer: {
      position: "relative" as const,
      width: "100%" as const,
      height: IMAGE_HEIGHT,
      borderTopLeftRadius: BorderRadius.lg,
      borderTopRightRadius: BorderRadius.lg,
      overflow: "hidden" as const,
    },
    carouselContainer: {
      width: "100%" as const,
      height: IMAGE_HEIGHT,
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
      height: IMAGE_HEIGHT,
    },
    animatedImage: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: CARD_WIDTH,
      height: IMAGE_HEIGHT,
    },
    placeholderImage: {
      width: CARD_WIDTH,
      height: IMAGE_HEIGHT,
      backgroundColor: colors.primary,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    placeholderText: {
      fontSize: 32,
      color: colors.textLight,
    },
    // Pagination dots
    paginationContainer: {
      position: "absolute" as const,
      bottom: Spacing.sm,
      alignSelf: "center" as const,
      flexDirection: "row" as const,
      zIndex: 10,
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginHorizontal: 2,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    paginationDotActive: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    // Map button
    mapButtonContainer: {
      position: "absolute" as const,
      top: Spacing.sm,
      right: Spacing.sm,
      zIndex: 10,
    },
    // Content section
    contentSection: {
      padding: Spacing.md,
    },
    titleContainer: {
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.bold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    locationContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: Spacing.sm,
    },
    locationText: {
      fontSize: Typography.sizes.xs,
      color: colors.textSecondary,
      marginLeft: Spacing.xs,
    },
    description: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    },
  };

  const renderImageCarousel = () => {
    if (!beach.photo_urls || beach.photo_urls.length === 0) {
      return (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>🏖️</Text>
        </View>
      );
    }

    if (beach.photo_urls.length === 1) {
      // Single image - no need for carousel
      return (
        <Image
          source={{ uri: beach.photo_urls[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      );
    }

    // Multiple images - render stacked carousel with fade animations
    return (
      <View style={styles.carouselContainer}>
        {/* Stacked images with fade animations */}
        <View style={styles.imageStack}>
          {beach.photo_urls.map((photoUrl, index) => (
            <Animated.View
              key={index}
              style={[
                styles.animatedImage,
                {
                  opacity:
                    fadeAnimsRef.current[index] ||
                    new Animated.Value(index === 0 ? 1 : 0),
                },
              ]}
            >
              <Image
                source={{ uri: photoUrl }}
                style={styles.image}
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
              style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPaginationDots = () => {
    if (!hasMultipleImages) return null;

    return (
      <View style={styles.paginationContainer}>
        {beach.photo_urls?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.container}>
        <CardContent style={{ padding: 0 }}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {renderImageCarousel()}

            {/* Pagination dots */}
            {renderPaginationDots()}

            {/* Map button */}
            <View style={styles.mapButtonContainer}>
              <BeachMapButton beach={beach} />
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title}>{getBeachName()}</ThemedText>
            </View>

            {showLocation && (
              <View style={styles.locationContainer}>
                <MapPin size={12} color={colors.textSecondary} />
                <ThemedText style={styles.locationText}>
                  {beach.municipality.name}
                </ThemedText>
              </View>
            )}

            <ThemedText style={styles.description} numberOfLines={3}>
              {getBeachDescription()}
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
