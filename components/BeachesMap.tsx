import React, { useEffect, useRef } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { ThemedText } from "@/components/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { router } from "expo-router";

interface BeachesMapProps {
  beaches: Beach[];
  onBeachPress?: (beach: Beach) => void;
  focusBeachId?: string;
  focusLatitude?: string;
  focusLongitude?: string;
}

const { width, height } = Dimensions.get("window");

export default function BeachesMap({
  beaches,
  onBeachPress,
  focusBeachId,
  focusLatitude,
  focusLongitude,
}: BeachesMapProps) {
  const { colors, themedStyles } = useThemedStyles();
  const mapRef = useRef<MapView>(null);

  // Albania's approximate center for initial region
  const initialRegion = {
    latitude: 40.6401,
    longitude: 19.9956,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  // Focus on specific beach when parameters are provided
  useEffect(() => {
    if (focusLatitude && focusLongitude && mapRef.current) {
      const latitude = parseFloat(focusLatitude);
      const longitude = parseFloat(focusLongitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        setTimeout(() => {
          mapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            },
            1000
          );
        }, 500); // Small delay to ensure map is fully loaded
      }
    }
  }, [focusLatitude, focusLongitude, beaches]);

  const handleMarkerPress = (beach: Beach) => {
    router.push(`/beach-detail?id=${beach.id}`);
    onBeachPress?.(beach);
  };

  const getBeachName = (beach: Beach) => {
    return beach.name_en.replace(/beach|beach of/gi, "").trim();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      ...themedStyles.background,
    },
    map: {
      width,
      height, // Full screen height
    },
    markerContainer: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 8,
      borderWidth: 2,
      borderColor: colors.textLight,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    markerText: {
      color: colors.textLight,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        rotateEnabled={true}
        pitchEnabled={true}
      >
        {beaches.map((beach) => {
          const latitude = parseFloat(beach.latitude);
          const longitude = parseFloat(beach.longitude);

          if (isNaN(latitude) || isNaN(longitude)) {
            return null; // Skip beaches with invalid coordinates
          }

          return (
            <Marker
              key={beach.id}
              coordinate={{
                latitude,
                longitude,
              }}
              title={getBeachName(beach)}
              description={beach.municipality.name}
              onPress={() => handleMarkerPress(beach)}
            >
              <View style={styles.markerContainer}>
                <ThemedText style={styles.markerText}>🏖️</ThemedText>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
