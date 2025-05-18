import { CURRENCY_CONFIG } from "@/config/api";
import { CurrencyApiResponse, CurrencyType } from "@/types";

const currencyMap = {
  VND: "Việt Nam Đồng",
  USD: "Đô la Mỹ",
  EUR: "Euro",
  JPY: "Yên Nhật",
  KRW: "Won Hàn Quốc",
  CNY: "Nhân dân tệ",
  SGD: "Đô la Singapore",
  THB: "Baht Thái",
  AUD: "Đô la Úc",
  HKD: "Đô la Hồng Kông",
};

export const transformCurrencyData = (
  response: CurrencyApiResponse
): CurrencyType[] => {
  const { data } = response;
  return Object.entries(data).map(([key, currency]) => ({
    code: currency.code,
    value: currency.value,
    name: currencyMap[key as keyof typeof currencyMap],
  }));
};

export const fetchCurrencies = async (
  base_currency: string
): Promise<CurrencyType[]> => {
  try {
    const response = base_currency
      ? await fetch(
          `${CURRENCY_CONFIG.API_URL}apikey=${CURRENCY_CONFIG.API_KEY}&currencies=${CURRENCY_CONFIG.currencies}&base_currency=${base_currency}`
        )
      : await fetch(
          `${CURRENCY_CONFIG.API_URL}apikey=${CURRENCY_CONFIG.API_KEY}&currencies=${CURRENCY_CONFIG.currencies}`
        );
    const data: CurrencyApiResponse = await response.json();
    return transformCurrencyData(data);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
};
