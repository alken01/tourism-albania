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
const AUTO_SLIDE_INTERVAL = 3000; // 3 seconds

export default function BeachCard({
  beach,
  onPress,
  showLocation = true,
}: BeachCardProps) {
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoSlideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getLocalizedField = useLocalizedField();

  // Auto-slide functionality
  useEffect(() => {
    const hasMultipleImages = beach.photo_urls && beach.photo_urls.length > 1;

    if (!hasMultipleImages) return;

    const startAutoSlide = () => {
      autoSlideTimerRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % beach.photo_urls!.length;

          // Scroll to next image
          scrollViewRef.current?.scrollTo({
            x: nextIndex * CARD_WIDTH,
            animated: true,
          });

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

    // Restart auto-slide after user interaction
    autoSlideTimerRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % beach.photo_urls!.length;

        scrollViewRef.current?.scrollTo({
          x: nextIndex * CARD_WIDTH,
          animated: true,
        });

        return nextIndex;
      });
    }, AUTO_SLIDE_INTERVAL);
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
    image: {
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

    // Multiple images - render carousel with auto-slide
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        style={cardStyles.carouselContainer}
      >
        {beach.photo_urls.map((photoUrl, index) => (
          <Image
            key={index}
            source={{ uri: photoUrl }}
            style={cardStyles.image}
            contentFit="cover"
            transition={200}
          />
        ))}
      </ScrollView>
    );
  };

  const renderPaginationDots = () => {
    if (!hasMultipleImages) return null;

    return (
      <View style={cardStyles.paginationContainer}>
        {beach.photo_urls?.map((_, index) => (
          <View
            key={index}
            style={[
              cardStyles.paginationDot,
              index === currentImageIndex && cardStyles.paginationDotActive,
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
