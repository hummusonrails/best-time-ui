"use client";

import { useLanguage, useTranslation } from "../lib/I18nContext";

interface SisterSite {
  href: string;
  nameEn: string;
  nameHe: string;
}

interface Props {
  lastUpdated: Date | null;
  /** @deprecated Use `sisterSites` instead */
  sisterSite?: SisterSite;
  sisterSites?: SisterSite[];
}

export default function Footer({ lastUpdated, sisterSite, sisterSites }: Props) {
  const { lang } = useLanguage();
  const { t } = useTranslation();

  // Merge legacy single prop with new array prop
  const sites: SisterSite[] = sisterSites ?? (sisterSite ? [sisterSite] : []);

  return (
    <footer className="w-full py-8 px-4 mt-8 border-t border-divider">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs text-cream/30">
          {t("dataSource")}
        </p>
        {lastUpdated && (
          <p className="font-mono text-xs text-cream/20">
            {t("lastUpdated")}:{" "}
            {lastUpdated.toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        )}
        <p className="font-mono text-xs text-cream/15">
          {t("autoRefresh")}
        </p>
        <p className="font-mono text-xs text-cream/30 mt-2">
          {lang === "he" ? "נבנה ע״י" : "Made by"}{" "}
          <a
            href="https://www.hummusonrails.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-cream transition-colors duration-300 underline underline-offset-2"
          >
            Ben Greenberg
          </a>
        </p>
        {sites.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
            {sites.map((site) => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-cream/20 hover:text-cream/40 transition-colors duration-300 underline underline-offset-2 decoration-cream/10 hover:decoration-cream/25"
              >
                {lang === "he" ? site.nameHe : site.nameEn}
              </a>
            ))}
          </div>
        )}
        <a
          href="https://buymeacoffee.com/bengreenberg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-surface-1 hover:bg-surface-2 font-mono text-xs text-cream/50 hover:text-cream transition-all duration-500 ease-smooth"
        >
          <span>☕</span>
          <span>{lang === "he" ? "קנו לי קפה" : "Buy me a coffee"}</span>
        </a>
      </div>
    </footer>
  );
}
