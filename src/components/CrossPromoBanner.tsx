"use client";

import { useLanguage } from "../lib/I18nContext";

interface SisterSite {
  href: string;
  name: string;
  promptEn: string;
  promptHe: string;
}

type Props =
  | SisterSite                        // single site (backward-compatible)
  | { sites: SisterSite[] };          // multiple sites

function isSingle(props: Props): props is SisterSite {
  return "href" in props;
}

export default function CrossPromoBanner(props: Props) {
  const { lang } = useLanguage();
  const sites = isSingle(props) ? [props] : props.sites;

  if (sites.length === 0) return null;

  return (
    <div className="w-full bg-surface-1/50 border-b border-divider">
      {sites.map((site) => (
        <a
          key={site.href}
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full px-4 py-2 hover:bg-surface-1 transition-all duration-500 ease-smooth"
        >
          <p className="text-center font-mono text-[11px] text-cream/25 group-hover:text-cream/45 transition-colors duration-500 ease-smooth">
            {lang === "he" ? (
              <>
                {site.promptHe}{" "}
                <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
                  {site.name}
                </span>
                {" \u2192"}
              </>
            ) : (
              <>
                {site.promptEn}{" "}
                <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
                  {site.name}
                </span>
                {" \u2192"}
              </>
            )}
          </p>
        </a>
      ))}
    </div>
  );
}
