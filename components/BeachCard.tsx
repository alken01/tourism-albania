import BeachMapButton from "@/components/BeachMapButton";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/GlobalStyles";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface BeachCardProps {
  beach: Beach;
  onPress?: (beach: Beach) => void;
  showLocation?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.md) / 1.7;
const CARD_HEIGHT = 300;

export default function BeachCard({
  beach,
  onPress,
  showLocation = true,
}: BeachCardProps) {
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();

  const getLocalizedField = useLocalizedField();

  const handlePress = () => {
    // Navigate to beach detail page
    router.push(`/beach/${beach.id}`);
    // Also call the optional onPress callback
    onPress?.(beach);
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
    image: {
      width: "100%" as const,
      height: CARD_HEIGHT,
    },
    placeholderImage: {
      width: "100%" as const,
      height: CARD_HEIGHT,
      backgroundColor: colors.primary,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    placeholderText: {
      fontSize: 48,
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

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={cardStyles.container}>
        <View style={cardStyles.imageContainer}>
          {beach.photo_urls && beach.photo_urls.length > 0 ? (
            <Image
              source={{ uri: beach.photo_urls[0] }}
              style={cardStyles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={cardStyles.placeholderImage}>
              <Text style={cardStyles.placeholderText}>🏖️</Text>
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.0)", "rgba(0,0,0,1)"]}
            locations={[0, 0.0, 1]}
            style={cardStyles.gradientOverlay}
          />

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
