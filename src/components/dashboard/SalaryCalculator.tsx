import { Calculator, Download, FileText, RotateCcw, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/dashboard/FlagIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRIES,
  computeSalary,
  convert,
  formatMoney,
  getCountry,
  type SalaryResult,
} from "@/lib/finance";
import { useI18n } from "@/lib/i18n";

type Props = {
  salary: string;
  setSalary: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  compareCode: string;
  setCompareCode: (v: string) => void;
  onReset: () => void;
};

export function SalaryCalculator({
  salary,
  setSalary,
  countryCode,
  setCountryCode,
  compareCode,
  setCompareCode,
  onReset,
}: Props) {
  const { t, locale } = useI18n();
  const country = getCountry(countryCode);
  const compare = getCountry(compareCode);
  const gross = Math.max(0, Number(salary) || 0);
  const result = computeSalary(gross, country);

  // Compare in the primary country's currency: convert salary over, compute, convert back.
  const compareGross = convert(gross, country.currency, compare.currency);
  const compareRaw = computeSalary(compareGross, compare);
  const compareResult: SalaryResult = {
    gross,
    tax: convert(compareRaw.tax, compare.currency, country.currency),
    net: convert(compareRaw.net, compare.currency, country.currency),
    rate: compareRaw.rate,
    monthly: convert(compareRaw.monthly, compare.currency, country.currency),
    weekly: convert(compareRaw.weekly, compare.currency, country.currency),
  };

  const fmt = (v: number) => formatMoney(v, country.currency, locale);
  const cname = (code: string) => t(code);

  const rows: { label: string; value: string; strong?: boolean }[] = [
    { label: t("grossAnnual"), value: fmt(result.gross) },
    { label: t("estTax"), value: `− ${fmt(result.tax)}` },
    { label: t("netAnnual"), value: fmt(result.net), strong: true },
    { label: t("netMonthly"), value: fmt(result.monthly) },
    { label: t("netWeekly"), value: fmt(result.weekly) },
  ];

  const breakdown = [
    { name: t("netSalary"), value: Math.max(result.net, 0), fill: "#0d9488" },
    { name: t("tax"), value: Math.max(result.tax, 0), fill: "#2563eb" },
  ];

  const comparison = [
    {
      name: cname(country.code),
      [t("tax")]: Math.round(result.tax),
      [t("netSalary")]: Math.round(result.net),
    },
    {
      name: cname(compare.code),
      [t("tax")]: Math.round(compareResult.tax),
      [t("netSalary")]: Math.round(compareResult.net),
    },
  ];

  function downloadCsv() {
    const lines = [
      ["Metric", cname(country.code), cname(compare.code)],
      ["Currency", country.currency, country.currency],
      ["Gross annual", result.gross.toFixed(2), compareResult.gross.toFixed(2)],
      ["Estimated tax", result.tax.toFixed(2), compareResult.tax.toFixed(2)],
      [
        "Effective tax rate",
        (result.rate * 100).toFixed(2) + "%",
        (compareResult.rate * 100).toFixed(2) + "%",
      ],
      ["Net annual", result.net.toFixed(2), compareResult.net.toFixed(2)],
      ["Net monthly", result.monthly.toFixed(2), compareResult.monthly.toFixed(2)],
      ["Net weekly", result.weekly.toFixed(2), compareResult.weekly.toFixed(2)],
    ];
    const csv = lines.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `salary-${country.code}-vs-${compare.code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    window.print();
  }

  return (
    <section className="card-surface flex flex-1 flex-col gap-6 p-6 sm:p-8">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Calculator className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{t("calcTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("calcSubtitle")}</p>
        </div>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="salary">
            {t("annualSalary")} ({country.currency})
          </Label>
          <Input
            id="salary"
            type="number"
            min={0}
            inputMode="decimal"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="60000"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label>{t("country")}</Label>
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <FlagIcon code={c.code} name={cname(c.code)} /> {cname(c.code)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{t("effectiveRate")}</span>
          <span className="font-semibold text-primary">{(result.rate * 100).toFixed(1)}%</span>
        </div>
        <Progress value={Math.min(result.rate * 100, 100)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-0 odd:bg-muted/40">
                <td className="px-4 py-3 text-start text-muted-foreground">{r.label}</td>
                <td
                  className={`px-4 py-3 text-end tabular-nums ${r.strong ? "text-base font-semibold text-accent" : "font-medium"}`}
                >
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{t("breakdown")}</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {breakdown.map((d) => (
                    <Cell key={d.name} fill={d.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            {breakdown.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: d.fill }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{t("comparison")}</h3>
            <Select value={compareCode} onValueChange={setCompareCode}>
              <SelectTrigger className="h-8 w-[9.5rem] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter((c) => c.code !== country.code).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <FlagIcon code={c.code} name={cname(c.code)} /> {cname(c.code)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar
                  dataKey={t("netSalary")}
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey={t("tax")}
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-start text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 text-start font-medium">{t("country")}</th>
              <th className="px-4 py-2 text-end font-medium">{t("taxRate")}</th>
              <th className="px-4 py-2 text-end font-medium">{t("tax")}</th>
              <th className="px-4 py-2 text-end font-medium">{t("netSalary")}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { c: country, r: result },
              { c: compare, r: compareResult },
            ].map(({ c, r }) => (
              <tr key={c.code} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-2">
                    <FlagIcon code={c.code} name={cname(c.code)} /> {cname(c.code)}
                  </span>
                </td>
                <td className="px-4 py-3 text-end tabular-nums">{(r.rate * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-end tabular-nums">{fmt(r.tax)}</td>
                <td className="px-4 py-3 text-end font-semibold tabular-nums">{fmt(r.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="gradient" onClick={exportPdf} className="no-print">
          <FileText /> {t("exportPdf")}
        </Button>
        <Button variant="soft" onClick={downloadCsv} className="no-print">
          <Download /> {t("downloadCsv")}
        </Button>
        <Button variant="soft" onClick={onReset} className="no-print">
          <RotateCcw /> {t("reset")}
        </Button>
        <span className="ms-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wallet className="size-3.5" /> {t("shownIn")} {country.currency}
        </span>
      </div>
    </section>
  );
}
