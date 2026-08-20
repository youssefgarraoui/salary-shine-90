import { Languages } from "lucide-react";

import { FlagIcon } from "@/components/dashboard/FlagIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="no-print flex items-center gap-2">
      <Languages className="size-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{t("language")}</span>
      <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
        <SelectTrigger className="h-9 w-[10rem]" aria-label={t("language")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGS.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              <span className="flex items-center gap-2">
                <FlagIcon code={l.flag} name={l.label} /> {l.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
