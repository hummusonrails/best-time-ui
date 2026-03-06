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
    <div className="w-full bg-surface-1/50 border-b border-divider px-4 py-2">
      <p className="text-center font-mono text-[11px] text-cream/25">
        {sites.map((site, i) => (
          <span key={site.href}>
            {i > 0 && <span className="mx-2 text-cream/15">·</span>}
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream/45 transition-colors duration-500 ease-smooth"
            >
              {lang === "he" ? site.promptHe : site.promptEn}{" "}
              <span className="font-serif italic text-cream/35 hover:text-cream/60 transition-colors duration-500">
                {site.name}
              </span>
              {" \u2192"}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
