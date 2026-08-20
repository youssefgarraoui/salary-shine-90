import { createFileRoute } from "@tanstack/react-router";
import { Info, LineChart } from "lucide-react";
import { useState } from "react";

import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { LanguageSwitcher } from "@/components/dashboard/LanguageSwitcher";
import { SalaryCalculator } from "@/components/dashboard/SalaryCalculator";
import { LanguageProvider, useI18n } from "@/lib/i18n";

const TITLE = "Salaire & Devises — Impôt, comparaison de pays et change";
const DESCRIPTION =
  "Calculez le salaire net et l'impôt par pays, comparez deux pays, convertissez TND, EUR, USD, GBP, CAD, CHF, JPY, AUD — en français, arabe et anglais, avec export PDF.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}

function Dashboard() {
  const { t } = useI18n();
  const [salary, setSalary] = useState("60000");
  const [countryCode, setCountryCode] = useState("FR");
  const [compareCode, setCompareCode] = useState("TN");

  function reset() {
    setSalary("60000");
    setCountryCode("FR");
    setCompareCode("TN");
  }

  return (
    <main className="page-surface min-h-screen px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <LineChart className="size-3.5" /> {t("badge")}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title1")} <span className="gradient-text">{t("title2")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <SalaryCalculator
            salary={salary}
            setSalary={setSalary}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            compareCode={compareCode}
            setCompareCode={setCompareCode}
            onReset={reset}
          />
          <CurrencyConverter />
        </div>

        <p className="flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t("disclaimer")}
        </p>
      </div>
    </main>
  );
}
