import { ThemedText } from "@/components/ThemedText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocalizedField } from "@/hooks/useLanguage";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Beach } from "@/types/api";
import { BarChart3, Info, MapPin } from "lucide-react-native";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

const { width } = Dimensions.get("window");

interface BeachInfoSectionProps {
  beach: Beach;
}

export default function BeachInfoSection({ beach }: BeachInfoSectionProps) {
  const getLocalizedField = useLocalizedField();
  const { colors, Spacing, Typography, BorderRadius } = useThemedStyles();

  const getBeachDescription = () => {
    return getLocalizedField(beach, "description");
  };

  const beachLocation = {
    latitude: parseFloat(beach.latitude),
    longitude: parseFloat(beach.longitude),
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.md,
    },
    statsCard: {
      marginBottom: Spacing.sm,
    },
    cardHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    cardTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statLabel: {
      fontSize: Typography.sizes.xs,
      color: colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: Typography.weights.semibold,
      marginBottom: Spacing.xs,
    },
    statValue: {
      fontSize: Typography.sizes.sm,
      color: colors.text,
      fontWeight: Typography.weights.medium,
      textAlign: "center",
    },
    infoCard: {
      marginBottom: Spacing.sm,
    },
    description: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
      color: colors.textSecondary,
    },
    mapCard: {
      marginBottom: Spacing.sm,
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
      {/* Beach Stats Card */}
      <Card style={styles.statsCard}>
        <CardHeader>
          <View style={styles.cardHeaderContent}>
            <BarChart3 size={20} color={colors.primary} />
            <ThemedText style={styles.cardTitle}>Beach Details</ThemedText>
          </View>
        </CardHeader>
        <CardContent>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Type</ThemedText>
              <ThemedText style={styles.statValue}>
                {beach.is_public ? "Public" : "Private"}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Municipality</ThemedText>
              <ThemedText style={styles.statValue}>
                {beach.municipality.name}
              </ThemedText>
            </View>
            {beach.nearby_places && (
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Nearby</ThemedText>
                <ThemedText style={styles.statValue}>
                  {beach.nearby_places.reduce(
                    (total, group) => total + group.places.length,
                    0
                  )}{" "}
                  places
                </ThemedText>
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Beach Information Card */}
      <Card style={styles.infoCard}>
        <CardHeader>
          <View style={styles.cardHeaderContent}>
            <Info size={20} color={colors.primary} />
            <ThemedText style={styles.cardTitle}>About This Beach</ThemedText>
          </View>
        </CardHeader>
        <CardContent>
          <ThemedText style={styles.description}>
            {getBeachDescription()}
          </ThemedText>
        </CardContent>
      </Card>

      {/* Map Card */}
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
