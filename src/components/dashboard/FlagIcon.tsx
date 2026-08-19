type Props = {
  code: string;
  name: string;
  className?: string;
};

/** Renders a real flag image (emoji flags fall back to letters on Windows/Linux). */
export function FlagIcon({ code, name, className }: Props) {
  const cc = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`}
      alt={`${name} flag`}
      width={20}
      height={15}
      loading="lazy"
      className={`inline-block h-[0.95em] w-auto shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-border ${className ?? ""}`}
    />
  );
}
