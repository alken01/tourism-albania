import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface BeachImageCarouselProps {
  beach: Beach;
}

export default function BeachImageCarousel({ beach }: BeachImageCarouselProps) {
  const getLocalizedField = useLocalizedField();
  const { t } = useLanguage();
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const getBeachName = () => {
    return getLocalizedField(beach, "name");
  };

  const getBeachType = () => {
    if (beach.is_public) {
      return t("public_beach");
    } else {
      return t("private_beach");
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const imageWidth = width - Spacing.lg * 2;
    const currentIndex = Math.round(scrollPosition / imageWidth);
    setCurrentImageIndex(currentIndex);
  };

  if (!beach?.photo_urls || beach.photo_urls.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    cardContainer: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      overflow: "hidden",
    },
    imageCarouselContainer: {
      height: 280,
      position: "relative",
      borderRadius: BorderRadius.lg,
      overflow: "hidden",
    },
    carouselImage: {
      width: width - Spacing.lg * 2,
      height: 280,
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    topRightContainer: {
      position: "absolute",
      top: Spacing.lg,
      right: Spacing.lg,
    },
    typeBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    typeText: {
      color: colors.text,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.bold,
      textTransform: "uppercase",
    },
    bottomContainer: {
      position: "absolute",
      bottom: Spacing.lg,
      left: Spacing.lg,
      right: Spacing.lg,
    },
    beachTitle: {
      fontSize: Typography.sizes.xl,
      fontWeight: Typography.weights.bold,
      color: colors.textLight,
      marginBottom: Spacing.xs,
      textShadowColor: "rgba(0, 0, 0, 0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      alignSelf: "flex-start",
    },
    locationText: {
      fontSize: Typography.sizes.sm,
      color: colors.textLight,
      fontWeight: Typography.weights.medium,
      marginLeft: Spacing.xs,
    },
    imageIndicatorContainer: {
      position: "absolute",
      bottom: Spacing.sm,
      alignSelf: "center",
      flexDirection: "row",
    },
    imageIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: 2,
    },
    activeImageIndicator: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  });

  return (
    <Card style={styles.cardContainer}>
      <CardContent style={{ padding: 0 }}>
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={beach.photo_urls}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                contentFit="cover"
                transition={200}
              />
            )}
            keyExtractor={(item, index) => `image-${index}`}
          />

          <View style={styles.imageOverlay} />

          <View style={styles.topRightContainer}>
            <View style={styles.typeBadge}>
              <ThemedText style={styles.typeText}>{getBeachType()}</ThemedText>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <ThemedText style={styles.beachTitle}>{getBeachName()}</ThemedText>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.textLight} />
              <ThemedText style={styles.locationText}>
                {beach.municipality.name}
              </ThemedText>
            </View>
          </View>

          {beach.photo_urls.length > 1 && (
            <View style={styles.imageIndicatorContainer}>
              {beach.photo_urls.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageIndicator,
                    index === currentImageIndex && styles.activeImageIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
