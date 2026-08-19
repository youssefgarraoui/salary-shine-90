import { Calculator, Download, RotateCcw, Wallet } from "lucide-react";
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

  const fmt = (v: number) => formatMoney(v, country.currency);

  const rows: { label: string; value: string; strong?: boolean }[] = [
    { label: "Gross annual salary", value: fmt(result.gross) },
    { label: "Estimated tax", value: `− ${fmt(result.tax)}` },
    { label: "Net annual salary", value: fmt(result.net), strong: true },
    { label: "Net monthly salary", value: fmt(result.monthly) },
    { label: "Net weekly salary", value: fmt(result.weekly) },
  ];

  const breakdown = [
    { name: "Net salary", value: Math.max(result.net, 0), fill: "var(--color-chart-2)" },
    { name: "Tax", value: Math.max(result.tax, 0), fill: "var(--color-chart-1)" },
  ];

  const comparison = [
    {
      name: `${country.flag} ${country.name}`,
      Tax: Math.round(result.tax),
      Net: Math.round(result.net),
    },
    {
      name: `${compare.flag} ${compare.name}`,
      Tax: Math.round(compareResult.tax),
      Net: Math.round(compareResult.net),
    },
  ];

  function downloadCsv() {
    const lines = [
      ["Metric", country.name, compare.name],
      ["Currency", country.currency, country.currency],
      ["Gross annual", result.gross.toFixed(2), compareResult.gross.toFixed(2)],
      ["Estimated tax", result.tax.toFixed(2), compareResult.tax.toFixed(2)],
      ["Effective tax rate", (result.rate * 100).toFixed(2) + "%", (compareResult.rate * 100).toFixed(2) + "%"],
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

  return (
    <section className="card-surface flex flex-1 flex-col gap-6 p-6 sm:p-8">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Calculator className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Salary tax calculator</h2>
          <p className="text-sm text-muted-foreground">Approximate progressive tax estimate</p>
        </div>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="salary">Annual salary ({country.currency})</Label>
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
          <Label>Country</Label>
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Effective tax rate</span>
          <span className="font-semibold text-primary">{(result.rate * 100).toFixed(1)}%</span>
        </div>
        <Progress value={Math.min(result.rate * 100, 100)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-0 odd:bg-muted/40">
                <td className="px-4 py-3 text-muted-foreground">{r.label}</td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${r.strong ? "text-base font-semibold text-accent" : "font-medium"}`}
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
          <h3 className="text-sm font-semibold">Salary breakdown</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
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
            <h3 className="text-sm font-semibold">Country comparison</h3>
            <Select value={compareCode} onValueChange={setCompareCode}>
              <SelectTrigger className="h-8 w-[9.5rem] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter((c) => c.code !== country.code).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.name}
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
                <Bar dataKey="Net" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Tax" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 text-right font-medium">Tax rate</th>
              <th className="px-4 py-2 text-right font-medium">Tax</th>
              <th className="px-4 py-2 text-right font-medium">Net salary</th>
            </tr>
          </thead>
          <tbody>
            {[
              { c: country, r: result },
              { c: compare, r: compareResult },
            ].map(({ c, r }) => (
              <tr key={c.code} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  {c.flag} {c.name}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{(r.rate * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.tax)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(r.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="gradient" onClick={downloadCsv}>
          <Download /> Download CSV
        </Button>
        <Button variant="soft" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wallet className="size-3.5" /> Comparison shown in {country.currency}
        </span>
      </div>
    </section>
  );
}
