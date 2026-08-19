export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: CurrencyCode;
  /** Approximate effective income tax + social contribution brackets */
  brackets: { upTo: number; rate: number }[];
};

export type CurrencyCode = "TND" | "EUR" | "USD" | "GBP" | "CAD" | "CHF" | "JPY" | "AUD";

/** Approximate exchange rates, relative to 1 USD. Indicative only. */
export const RATES_PER_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 152,
  TND: 3.12,
};

export const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: "TND", name: "Tunisian Dinar", symbol: "DT" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
];

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode) {
  const usd = amount / RATES_PER_USD[from];
  return usd * RATES_PER_USD[to];
}

/** Approximate progressive tax brackets (income tax, simplified). */
export const COUNTRIES: Country[] = [
  {
    code: "TN",
    name: "Tunisia",
    flag: "🇹🇳",
    currency: "TND",
    brackets: [
      { upTo: 5000, rate: 0 },
      { upTo: 20000, rate: 0.26 },
      { upTo: 30000, rate: 0.28 },
      { upTo: 50000, rate: 0.32 },
      { upTo: Infinity, rate: 0.35 },
    ],
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    brackets: [
      { upTo: 11294, rate: 0 },
      { upTo: 28797, rate: 0.11 },
      { upTo: 82341, rate: 0.3 },
      { upTo: 177106, rate: 0.41 },
      { upTo: Infinity, rate: 0.45 },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    brackets: [
      { upTo: 11604, rate: 0 },
      { upTo: 66760, rate: 0.28 },
      { upTo: 277825, rate: 0.42 },
      { upTo: Infinity, rate: 0.45 },
    ],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    brackets: [
      { upTo: 11600, rate: 0.1 },
      { upTo: 47150, rate: 0.12 },
      { upTo: 100525, rate: 0.22 },
      { upTo: 191950, rate: 0.24 },
      { upTo: 243725, rate: 0.32 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    brackets: [
      { upTo: 12570, rate: 0 },
      { upTo: 50270, rate: 0.2 },
      { upTo: 125140, rate: 0.4 },
      { upTo: Infinity, rate: 0.45 },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    brackets: [
      { upTo: 15705, rate: 0 },
      { upTo: 55867, rate: 0.15 },
      { upTo: 111733, rate: 0.205 },
      { upTo: 173205, rate: 0.26 },
      { upTo: Infinity, rate: 0.33 },
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    currency: "CHF",
    brackets: [
      { upTo: 17800, rate: 0 },
      { upTo: 78100, rate: 0.08 },
      { upTo: 169300, rate: 0.15 },
      { upTo: Infinity, rate: 0.22 },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    brackets: [
      { upTo: 1950000, rate: 0.05 },
      { upTo: 3300000, rate: 0.1 },
      { upTo: 6950000, rate: 0.2 },
      { upTo: 9000000, rate: 0.23 },
      { upTo: 18000000, rate: 0.33 },
      { upTo: Infinity, rate: 0.4 },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    brackets: [
      { upTo: 18200, rate: 0 },
      { upTo: 45000, rate: 0.19 },
      { upTo: 120000, rate: 0.325 },
      { upTo: 180000, rate: 0.37 },
      { upTo: Infinity, rate: 0.45 },
    ],
  },
];

export type SalaryResult = {
  gross: number;
  tax: number;
  net: number;
  rate: number;
  monthly: number;
  weekly: number;
};

export function computeSalary(gross: number, country: Country): SalaryResult {
  let tax = 0;
  let prev = 0;
  for (const b of country.brackets) {
    if (gross > prev) {
      const taxable = Math.min(gross, b.upTo) - prev;
      tax += taxable * b.rate;
      prev = b.upTo;
    } else break;
  }
  const net = gross - tax;
  return {
    gross,
    tax,
    net,
    rate: gross > 0 ? tax / gross : 0,
    monthly: net / 12,
    weekly: net / 52,
  };
}

export function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function getCountry(code: string) {
  return (COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]) as Country;
}
