import { useCallback, useEffect, useState } from "react";

interface CurrencyData {
  date: string;
  all: Record<string, number>;
}

interface CurrencyState {
  data: CurrencyData | null;
  loading: boolean;
  error: string | null;
}

// Main currencies to display
const MAIN_CURRENCIES = ["eur", "usd", "gbp", "chf"] as const;

export function useCurrency() {
  const [state, setState] = useState<CurrencyState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchCurrencyData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/all.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data: CurrencyData = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch currency data",
      });
    }
  }, []);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  // Calculate exchange rate (1 currency = X ALL)
  const getExchangeRate = (currencyCode: string): number => {
    if (!state.data?.all[currencyCode]) return 0;

    // Convert to 4 decimal places for calculation, but we'll show 2
    const rate = 1 / state.data.all[currencyCode];
    return Math.round(rate * 10000) / 10000;
  };

  const getMainCurrencies = () => {
    return MAIN_CURRENCIES.map((currency) => ({
      code: currency.toUpperCase(),
      rate: getExchangeRate(currency),
    }));
  };

  return {
    ...state,
    refetch: fetchCurrencyData,
    getExchangeRate,
    getMainCurrencies,
  };
}
