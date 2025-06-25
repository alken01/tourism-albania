import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

interface BeachMapSectionProps {
  beach: Beach;
}

export default function BeachMapSection({ beach }: BeachMapSectionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();

  const beachLocation = {
    latitude: parseFloat(beach.latitude),
    longitude: parseFloat(beach.longitude),
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
    },
    mapCard: {
      overflow: "hidden",
    },
    mapContainer: {
      height: 200,
      borderRadius: BorderRadius.lg,
      overflow: "hidden",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
      position: "absolute",
      top: Spacing.md,
      left: Spacing.md,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    mapOverlayText: {
      fontSize: Typography.sizes.sm,
      fontWeight: Typography.weights.medium,
      color: colors.text,
      marginLeft: Spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Card style={styles.mapCard}>
        <CardContent style={{ padding: 0 }}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={
                Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
              }
              initialRegion={{
                ...beachLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={beachLocation}
                title={getLocalizedField(beach, "name")}
                description={beach.municipality.name}
              >
                <View
                  style={{
                    backgroundColor: colors.primary,
                    padding: 8,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "white",
                  }}
                >
                  <MapPin size={16} color="white" />
                </View>
              </Marker>
            </MapView>

            <View style={styles.mapOverlay}>
              <MapPin size={14} color={colors.primary} />
              <ThemedText style={styles.mapOverlayText}>
                {beach.municipality.name}
              </ThemedText>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
