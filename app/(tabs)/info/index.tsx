import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Spacing } from "@/constants/GlobalStyles";
import { useCurrency } from "@/hooks/useCurrency";
import { Language, useLanguage } from "@/hooks/useLanguage";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function InfoScreen() {
  const { language, setLanguage, t } = useLanguage();
  const currency = useCurrency();
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={currency.loading}
            onRefresh={currency.refetch}
          />
        }
      >
        {/* Language Settings */}
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

        {/* Emergency Numbers */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            {t("emergency_numbers")}
          </ThemedText>
          {EMERGENCY_NUMBERS.map((emergency) => (
            <TouchableOpacity
              key={emergency.key}
              style={[
                styles.emergencyItem,
                { borderBottomColor: tintColor + "20" },
              ]}
              onPress={() => handleCall(emergency.number)}
            >
              <View style={styles.emergencyLeft}>
                <IconSymbol
                  name={emergency.icon as any}
                  size={24}
                  color={tintColor}
                />
                <ThemedText style={styles.emergencyTitle}>
                  {t(emergency.key)}
                </ThemedText>
              </View>
              <View style={styles.emergencyRight}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.emergencyNumber}
                >
                  {emergency.number}
                </ThemedText>
                <IconSymbol name="phone.fill" size={16} color={tintColor} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Currency Exchange */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            {t("currency_exchange")}
          </ThemedText>
          {currency.loading ? (
            <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
          ) : currency.error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{currency.error}</ThemedText>
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
              {currency.getMainCurrencies().map((curr) => (
                <View
                  key={curr.code}
                  style={[
                    styles.currencyItem,
                    { borderBottomColor: tintColor + "20" },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.currencyCode}
                  >
                    {curr.code}
                  </ThemedText>
                  <ThemedText style={styles.currencyRate}>
                    1 {curr.code} = {curr.rate.toFixed(2)} ALL
                  </ThemedText>
                </View>
              ))}
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
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
    fontSize: 20,
    fontWeight: "bold",
  },
  languageContainer: {
    flexDirection: "row",
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emergencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  emergencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emergencyTitle: {
    fontSize: 16,
  },
  emergencyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emergencyNumber: {
    fontSize: 18,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  currencyCode: {
    fontSize: 16,
  },
  currencyRate: {
    fontSize: 16,
  },
  updateText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 12,
    color: "#ff6b6b",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  retryText: {
    fontWeight: "600",
  },
});
