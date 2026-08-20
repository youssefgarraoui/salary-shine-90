import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "ar";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "GB" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "ar", label: "العربية", flag: "TN" },
];

type Dict = Record<string, string>;

const en: Dict = {
  badge: "Financial toolkit",
  title1: "Salary &",
  title2: "Currency Dashboard",
  subtitle:
    "Estimate your take-home pay, compare tax burdens across countries, and convert currencies in one place.",
  disclaimer:
    "All tax brackets and exchange rates are approximate and simplified for illustration only — they are not financial advice.",
  language: "Language",

  calcTitle: "Salary tax calculator",
  calcSubtitle: "Approximate progressive tax estimate",
  annualSalary: "Annual salary",
  country: "Country",
  effectiveRate: "Effective tax rate",
  grossAnnual: "Gross annual salary",
  estTax: "Estimated tax",
  netAnnual: "Net annual salary",
  netMonthly: "Net monthly salary",
  netWeekly: "Net weekly salary",
  breakdown: "Salary breakdown",
  netSalary: "Net salary",
  tax: "Tax",
  comparison: "Country comparison",
  taxRate: "Tax rate",
  downloadCsv: "Download CSV",
  exportPdf: "Export PDF",
  reset: "Reset",
  shownIn: "Comparison shown in",

  fxTitle: "Currency converter",
  fxSubtitle: "Instant conversion, approximate rates",
  amount: "Amount",
  from: "From",
  to: "To",
  swap: "Swap currencies",
  equals: "equals",
  quickRates: "Quick rates from",

  TN: "Tunisia",
  FR: "France",
  DE: "Germany",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  CH: "Switzerland",
  JP: "Japan",
  AU: "Australia",
};

const fr: Dict = {
  badge: "Boîte à outils financière",
  title1: "Tableau de bord",
  title2: "Salaire & Devises",
  subtitle:
    "Estimez votre salaire net, comparez la pression fiscale entre pays et convertissez vos devises au même endroit.",
  disclaimer:
    "Les tranches d'imposition et les taux de change sont approximatifs et simplifiés à titre indicatif — ceci ne constitue pas un conseil financier.",
  language: "Langue",

  calcTitle: "Calculateur d'impôt sur le salaire",
  calcSubtitle: "Estimation progressive approximative",
  annualSalary: "Salaire annuel",
  country: "Pays",
  effectiveRate: "Taux d'imposition effectif",
  grossAnnual: "Salaire annuel brut",
  estTax: "Impôt estimé",
  netAnnual: "Salaire annuel net",
  netMonthly: "Salaire mensuel net",
  netWeekly: "Salaire hebdomadaire net",
  breakdown: "Répartition du salaire",
  netSalary: "Salaire net",
  tax: "Impôt",
  comparison: "Comparaison entre pays",
  taxRate: "Taux d'imposition",
  downloadCsv: "Télécharger le CSV",
  exportPdf: "Exporter en PDF",
  reset: "Réinitialiser",
  shownIn: "Comparaison affichée en",

  fxTitle: "Convertisseur de devises",
  fxSubtitle: "Conversion instantanée, taux approximatifs",
  amount: "Montant",
  from: "De",
  to: "Vers",
  swap: "Inverser les devises",
  equals: "équivaut à",
  quickRates: "Taux rapides depuis",

  TN: "Tunisie",
  FR: "France",
  DE: "Allemagne",
  US: "États-Unis",
  GB: "Royaume-Uni",
  CA: "Canada",
  CH: "Suisse",
  JP: "Japon",
  AU: "Australie",
};

const ar: Dict = {
  badge: "أدوات مالية",
  title1: "لوحة",
  title2: "الرواتب والعملات",
  subtitle: "قدّر راتبك الصافي، قارن الأعباء الضريبية بين البلدان، وحوّل العملات في مكان واحد.",
  disclaimer:
    "جميع الشرائح الضريبية وأسعار الصرف تقديرية ومبسطة لأغراض توضيحية فقط — وليست نصيحة مالية.",
  language: "اللغة",

  calcTitle: "حاسبة ضريبة الراتب",
  calcSubtitle: "تقدير تقريبي للضريبة التصاعدية",
  annualSalary: "الراتب السنوي",
  country: "البلد",
  effectiveRate: "معدل الضريبة الفعلي",
  grossAnnual: "الراتب السنوي الإجمالي",
  estTax: "الضريبة المقدرة",
  netAnnual: "الراتب السنوي الصافي",
  netMonthly: "الراتب الشهري الصافي",
  netWeekly: "الراتب الأسبوعي الصافي",
  breakdown: "توزيع الراتب",
  netSalary: "الراتب الصافي",
  tax: "الضريبة",
  comparison: "مقارنة بين البلدان",
  taxRate: "نسبة الضريبة",
  downloadCsv: "تنزيل CSV",
  exportPdf: "تصدير PDF",
  reset: "إعادة تعيين",
  shownIn: "المقارنة معروضة بعملة",

  fxTitle: "محوّل العملات",
  fxSubtitle: "تحويل فوري بأسعار تقريبية",
  amount: "المبلغ",
  from: "من",
  to: "إلى",
  swap: "تبديل العملتين",
  equals: "تساوي",
  quickRates: "أسعار سريعة من",

  TN: "تونس",
  FR: "فرنسا",
  DE: "ألمانيا",
  US: "الولايات المتحدة",
  GB: "المملكة المتحدة",
  CA: "كندا",
  CH: "سويسرا",
  JP: "اليابان",
  AU: "أستراليا",
};

const DICTS: Record<Lang, Dict> = { en, fr, ar };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  locale: string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      dir,
      locale: lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-FR" : "en-US",
      t: (key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key,
    }),
    [lang, dir],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
