import { Card, CardContent } from "@/components/ui/card";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface BeachImageCarouselProps {
  beach: Beach;
}

export default function BeachImageCarousel({ beach }: BeachImageCarouselProps) {
  const { colors, Spacing, BorderRadius } = useThemedStyles();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Calculate dimensions for proper snapping
  const cardMargin = Spacing.lg * 2; // left + right margins
  const containerPadding = Spacing.lg * 2; // left + right padding
  const imageGap = Spacing.md;
  const imageWidth = width - cardMargin - containerPadding;
  const snapInterval = imageWidth + imageGap;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / snapInterval);
    setCurrentImageIndex(currentIndex);
  };

  if (!beach?.photo_urls || beach.photo_urls.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    cardContainer: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
    },
    imageCarouselContainer: {
      height: 240,
      position: "relative",
    },
    carouselImage: {
      width: imageWidth,
      height: 240,
      borderRadius: BorderRadius.lg,
      marginRight: imageGap,
    },
    lastImage: {
      marginRight: 0, // Remove margin from last image
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
            pagingEnabled={false} // Disable default paging for custom snap
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={snapInterval}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: Spacing.lg,
            }}
            renderItem={({ item, index }) => (
              <Image
                source={{ uri: item }}
                style={[
                  styles.carouselImage,
                  index === beach.photo_urls.length - 1 && styles.lastImage,
                ]}
                contentFit="cover"
                transition={200}
              />
            )}
            keyExtractor={(item, index) => `image-${index}`}
          />

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
