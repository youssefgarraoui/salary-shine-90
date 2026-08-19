import { createFileRoute } from "@tanstack/react-router";
import { Info, LineChart } from "lucide-react";
import { useState } from "react";

import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { SalaryCalculator } from "@/components/dashboard/SalaryCalculator";

const TITLE = "Salary & Currency Dashboard — Tax and FX Estimates";
const DESCRIPTION =
  "Estimate net salary and tax by country, compare two countries side by side, and convert between TND, EUR, USD, GBP, CAD, CHF, JPY and AUD.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [salary, setSalary] = useState("60000");
  const [countryCode, setCountryCode] = useState("TN");
  const [compareCode, setCompareCode] = useState("FR");

  function reset() {
    setSalary("60000");
    setCountryCode("TN");
    setCompareCode("FR");
  }

  return (
    <main className="page-surface min-h-screen px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <LineChart className="size-3.5" /> Financial toolkit
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Salary &amp; <span className="gradient-text">Currency Dashboard</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Estimate your take-home pay, compare tax burdens across countries, and convert
            currencies in one place.
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
          All tax brackets and exchange rates are approximate and simplified for illustration only —
          they are not financial advice.
        </p>
      </div>
    </main>
  );
}
