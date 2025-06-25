import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { BorderRadius, BorderWidth, Spacing } from "@/constants/GlobalStyles";
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
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
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
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.cardHeader}>
        <Text variant="title" className="mb-1">
          {t("language_settings")}
        </Text>
      </View>

      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              borderColor: language === "en" ? tintColor : tintColor + "30",
              backgroundColor: language === "en" ? tintColor : "transparent",
            },
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text
            variant="default"
            className="font-semibold"
            style={{ color: language === "en" ? "#fff" : textColor }}
          >
            🇺🇸 EN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              borderColor: language === "sq" ? tintColor : tintColor + "30",
              backgroundColor: language === "sq" ? tintColor : "transparent",
            },
          ]}
          onPress={() => handleLanguageChange("sq")}
        >
          <Text
            variant="default"
            className="font-semibold"
            style={{ color: language === "sq" ? "#fff" : textColor }}
          >
            🇦🇱 SQ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmergencyItem = ({
    item,
    index,
  }: {
    item: (typeof EMERGENCY_NUMBERS)[0];
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.emergencyItem,
        index === EMERGENCY_NUMBERS.length - 1 && { borderBottomWidth: 0 },
      ]}
      onPress={() => handleCall(item.number)}
    >
      <View style={styles.emergencyLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: tintColor + "15" }]}
        >
          <IconSymbol name={item.icon as any} size={20} color={tintColor} />
        </View>
        <View>
          <Text variant="default" className="font-medium">
            {t(item.key)}
          </Text>
          <Text variant="small" className="opacity-70">
            Tap to call
          </Text>
        </View>
      </View>
      <View style={styles.emergencyRight}>
        <Text
          variant="large"
          className="font-bold"
          style={{ color: tintColor }}
        >
          {item.number}
        </Text>
        <IconSymbol name="chevron.right" size={16} color={textColor + "60"} />
      </View>
    </TouchableOpacity>
  );

  const renderCurrencyItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <View
      style={[
        styles.currencyItem,
        index === currency.getMainCurrencies().length - 1 && {
          borderBottomWidth: 0,
        },
      ]}
    >
      <View>
        <Text variant="default" className="font-semibold">
          {item.code}
        </Text>
        <Text variant="small" className="opacity-70">
          {item.name || item.code}
        </Text>
      </View>
      <Text variant="default" className="font-medium">
        {item.rate.toFixed(2)} ALL
      </Text>
    </View>
  );

  const renderSection = ({ item }: { item: SectionData }) => {
    switch (item.type) {
      case "language":
        return renderLanguageSection();
      case "emergency":
        return (
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.cardHeader}>
              <Text variant="title" className="mb-1">
                {item.title}
              </Text>
              <Text variant="muted">Emergency contacts in Albania</Text>
            </View>
            <View>
              {item.data?.map((emergency, index) => (
                <View key={emergency.key}>
                  {renderEmergencyItem({ item: emergency, index })}
                </View>
              ))}
            </View>
          </View>
        );
      case "currency":
        return (
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.cardHeader}>
              <Text variant="title" className="mb-1">
                {item.title}
              </Text>
              <Text variant="muted">
                Current exchange rates to Albanian Lek
              </Text>
            </View>
            {currency.loading ? (
              <View style={styles.loadingContainer}>
                <Text variant="default" className="opacity-70">
                  {t("loading")}...
                </Text>
              </View>
            ) : currency.error ? (
              <View style={styles.errorContainer}>
                <Text variant="error" className="text-center mb-3">
                  {currency.error}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { borderColor: tintColor }]}
                  onPress={currency.refetch}
                >
                  <Text
                    variant="default"
                    className="font-semibold"
                    style={{ color: tintColor }}
                  >
                    {t("retry")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View>
                  {item.data?.map((curr, index) => (
                    <View key={curr.code}>
                      {renderCurrencyItem({ item: curr, index })}
                    </View>
                  ))}
                </View>
                {currency.data && (
                  <View style={styles.updateInfo}>
                    <Text variant="caption" className="text-center opacity-70">
                      {t("last_updated").replace(
                        "{date}",
                        formatDate(currency.data.date)
                      )}
                    </Text>
                  </View>
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
        contentContainerStyle={styles.scrollContent}
        data={sections}
        renderItem={renderSection}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={currency.loading}
            onRefresh={currency.refetch}
          />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        contentInsetAdjustmentBehavior="automatic"
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
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  card: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: Spacing.lg,
  },
  languageContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  languageButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  emergencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  emergencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  emergencyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.md,
  },
  updateInfo: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: Spacing.sm,
  },
});
