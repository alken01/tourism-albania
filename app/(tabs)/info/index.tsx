import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import {
  BorderRadius,
  BorderWidth,
  Spacing,
  Typography,
} from "@/constants/GlobalStyles";
import { useCurrency } from "@/hooks/useCurrency";
import { Language, useLanguage } from "@/hooks/useLanguage";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMERGENCY_NUMBERS = [
  { key: "police", number: "129", icon: "shield.fill" },
  { key: "fire_department", number: "128", icon: "flame.fill" },
  { key: "ambulance", number: "127", icon: "cross.fill" },
  {
    key: "tourist_police",
    number: "126",
    icon: "person.badge.shield.checkmark.fill",
  },
];

type SectionData = {
  type: "language" | "emergency" | "currency";
  title: string;
  data?: any[];
};

export default function InfoScreen() {
  const { language, setLanguage, t } = useLanguage();
  const currency = useCurrency();
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const insets = useSafeAreaInsets();

  const handleCall = (number: string) => {
    Alert.alert(t("emergency_numbers"), `${t("police")}: ${number}`, [
      { text: t("cancel") || "Cancel", style: "cancel" },
      {
        text: t("call") || "Call",
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        language === "sq" ? "sq-AL" : "en-US"
      );
    } catch {
      return dateString;
    }
  };

  const sections: SectionData[] = [
    {
      type: "language",
      title: t("language_settings"),
    },
    {
      type: "emergency",
      title: t("emergency_numbers"),
      data: EMERGENCY_NUMBERS,
    },
    {
      type: "currency",
      title: t("currency_exchange"),
      data: currency.getMainCurrencies(),
    },
  ];

  const renderLanguageSection = () => (
    <View style={styles.section}>
      <ThemedText type="title" style={styles.sectionTitle}>
        {t("language_settings")}
      </ThemedText>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { borderColor: tintColor },
            language === "en" && { backgroundColor: tintColor },
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text
            style={[
              styles.languageButtonText,
              { color: language === "en" ? "#fff" : textColor },
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { borderColor: tintColor },
            language === "sq" && { backgroundColor: tintColor },
          ]}
          onPress={() => handleLanguageChange("sq")}
        >
          <Text
            style={[
              styles.languageButtonText,
              { color: language === "sq" ? "#fff" : textColor },
            ]}
          >
            Shqip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmergencyItem = ({
    item,
  }: {
    item: (typeof EMERGENCY_NUMBERS)[0];
  }) => (
    <TouchableOpacity
      style={[styles.emergencyItem, { borderBottomColor: tintColor + "20" }]}
      onPress={() => handleCall(item.number)}
    >
      <View style={styles.emergencyLeft}>
        <IconSymbol name={item.icon as any} size={24} color={tintColor} />
        <ThemedText style={styles.emergencyTitle}>{t(item.key)}</ThemedText>
      </View>
      <View style={styles.emergencyRight}>
        <ThemedText type="defaultSemiBold" style={styles.emergencyNumber}>
          {item.number}
        </ThemedText>
        <IconSymbol name="phone.fill" size={16} color={tintColor} />
      </View>
    </TouchableOpacity>
  );

  const renderCurrencyItem = ({ item }: { item: any }) => (
    <View
      style={[styles.currencyItem, { borderBottomColor: tintColor + "20" }]}
    >
      <ThemedText type="defaultSemiBold" style={styles.currencyCode}>
        {item.code}
      </ThemedText>
      <ThemedText style={styles.currencyRate}>
        1 {item.code} = {item.rate.toFixed(2)} ALL
      </ThemedText>
    </View>
  );

  const renderSection = ({ item }: { item: SectionData }) => {
    switch (item.type) {
      case "language":
        return renderLanguageSection();
      case "emergency":
        return (
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>
              {item.title}
            </ThemedText>
            <FlatList
              data={item.data}
              renderItem={renderEmergencyItem}
              keyExtractor={(emergency) => emergency.key}
              scrollEnabled={false}
            />
          </View>
        );
      case "currency":
        return (
          <View style={styles.section}>
            <ThemedText type="title" style={styles.sectionTitle}>
              {item.title}
            </ThemedText>
            {currency.loading ? (
              <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
            ) : currency.error ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  {currency.error}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.retryButton, { borderColor: tintColor }]}
                  onPress={currency.refetch}
                >
                  <ThemedText style={[styles.retryText, { color: tintColor }]}>
                    {t("retry")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <FlatList
                  data={item.data}
                  renderItem={renderCurrencyItem}
                  keyExtractor={(curr) => curr.code}
                  scrollEnabled={false}
                />
                {currency.data && (
                  <ThemedText style={styles.updateText}>
                    {t("last_updated").replace(
                      "{date}",
                      formatDate(currency.data.date)
                    )}
                  </ThemedText>
                )}
              </>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        data={sections}
        renderItem={renderSection}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={currency.loading}
            onRefresh={currency.refetch}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  languageContainer: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  languageButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.md,
    alignItems: "center",
  },
  languageButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  emergencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: BorderWidth.xs,
  },
  emergencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  emergencyTitle: {
    fontSize: Typography.sizes.md,
  },
  emergencyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  emergencyNumber: {
    fontSize: Typography.sizes.md,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  currencyCode: {
    fontSize: Typography.sizes.md,
  },
  currencyRate: {
    fontSize: Typography.sizes.md,
  },
  updateText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.sm,
    opacity: 0.7,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    padding: Spacing.md,
  },
  errorContainer: {
    alignItems: "center",
    padding: Spacing.md,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 12,
    color: Colors.light.error,
  },
  retryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.xs,
  },
  retryText: {
    fontWeight: Typography.weights.semibold,
  },
});
