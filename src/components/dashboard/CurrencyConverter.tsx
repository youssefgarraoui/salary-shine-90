import { ArrowLeftRight, Repeat } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, convert, formatMoney, type CurrencyCode } from "@/lib/finance";
import { useI18n } from "@/lib/i18n";

export function CurrencyConverter() {
  const { t, locale } = useI18n();
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState<CurrencyCode>("EUR");
  const [to, setTo] = useState<CurrencyCode>("TND");

  const value = Math.max(0, Number(amount) || 0);
  const converted = convert(value, from, to);
  const unit = convert(1, from, to);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className="card-surface flex flex-1 flex-col gap-6 p-6 sm:p-8">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Repeat className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{t("fxTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("fxSubtitle")}</p>
        </div>
      </header>

      <div className="space-y-2">
        <Label htmlFor="amount">{t("amount")}</Label>
        <Input
          id="amount"
          type="number"
          min={0}
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label>{t("from")}</Label>
          <Select value={from} onValueChange={(v) => setFrom(v as CurrencyCode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="soft"
          size="icon"
          onClick={swap}
          aria-label={t("swap")}
          className="no-print"
        >
          <ArrowLeftRight />
        </Button>
        <div className="flex-1 space-y-2">
          <Label>{t("to")}</Label>
          <Select value={to} onValueChange={(v) => setTo(v as CurrencyCode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {formatMoney(value, from, locale)} {t("equals")}
        </p>
        <p className="mt-1 text-3xl font-bold gradient-text sm:text-4xl">
          {formatMoney(converted, to, locale)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground" dir="ltr">
          1 {from} ≈ {unit.toFixed(4)} {to}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">
          {t("quickRates")} {from}
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CURRENCIES.filter((c) => c.code !== from).map((c) => (
            <div
              key={c.code}
              className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm"
              dir="ltr"
            >
              <span className="font-medium">{c.code}</span>
              <span className="ms-2 tabular-nums text-muted-foreground">
                {convert(1, from, c.code).toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
