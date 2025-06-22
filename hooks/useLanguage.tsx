import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "sq";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Tab titles
    events: "Events",
    beaches: "Beaches",
    info: "Info",
    categories: "Categories",
    map: "Map",
    public_beach: "Public Beach",
    private_beach: "Private Beach",

    // Info tab
    emergency_numbers: "Emergency Numbers",
    currency_exchange: "Currency Exchange",
    language_settings: "Language Settings",
    select_language: "Select Language",
    searchBeaches: "Search beaches",

    // Emergency numbers
    police: "Police",
    fire_department: "Fire Department",
    ambulance: "Ambulance",
    tourist_police: "Tourist Police",

    // Currency
    exchange_rate: "Exchange Rate (1 {currency} = {rate} ALL)",
    last_updated: "Last updated: {date}",

    // Common
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    cancel: "Cancel",
    call: "Call",
  },
  sq: {
    // Tab titles
    events: "Ngjarjet",
    beaches: "Plazhet",
    info: "Informacion",
    categories: "Kategoritë",
    map: "Harta",
    searchBeaches: "Kërko plazhet",
    public_beach: "Plazh Publik",
    private_beach: "Plazh Privat",

    // Info tab
    emergency_numbers: "Numrat e Emergjencës",
    currency_exchange: "Këmbimi i Monedhës",
    language_settings: "Gjuha",
    select_language: "Zgjidhni Gjuhën",

    // Emergency numbers
    police: "Policia",
    fire_department: "Zjarrfikësit",
    ambulance: "Ambulanca",
    tourist_police: "Policia Turistike",

    // Currency
    exchange_rate: "Kursi i Këmbimit (1 {currency} = {rate} ALL)",
    last_updated: "Përditësuar: {date}",

    // Common
    loading: "Duke u ngarkuar...",
    error: "Gabim",
    retry: "Riprovo",
    cancel: "Anulo",
    call: "Telefono",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "@tourism_albania_language";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sq")) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper hook to get the appropriate field based on current language
export function useLocalizedField() {
  const { language } = useLanguage();

  return (item: any, fieldName: string): string => {
    const localizedField = `${fieldName}_${language}`;
    return item[localizedField] || item[fieldName] || "";
  };
}
