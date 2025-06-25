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

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const imageWidth = width - Spacing.lg * 4; // Account for gaps
    const currentIndex = Math.round(scrollPosition / (imageWidth + Spacing.md));
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
      height: 280,
      position: "relative",
    },
    carouselImage: {
      width: width - Spacing.lg * 4,
      height: 280,
      borderRadius: BorderRadius.lg,
      marginHorizontal: Spacing.md,
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
            pagingEnabled={beach.photo_urls.length > 1}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={
              beach.photo_urls.length > 1
                ? width - Spacing.lg * 4 + Spacing.md * 2
                : undefined
            }
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: beach.photo_urls.length > 1 ? Spacing.md : 0,
            }}
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
