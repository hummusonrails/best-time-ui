"use client";

import { useLanguage } from "../lib/I18nContext";

interface Props {
  href: string;
  name: string;
  promptEn: string;
  promptHe: string;
}

export default function CrossPromoBanner({ href, name, promptEn, promptHe }: Props) {
  const { lang } = useLanguage();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full px-4 py-2 bg-surface-1/50 hover:bg-surface-1 border-b border-divider transition-all duration-500 ease-smooth"
    >
      <p className="text-center font-mono text-[11px] text-cream/25 group-hover:text-cream/45 transition-colors duration-500 ease-smooth">
        {lang === "he" ? (
          <>
            {promptHe}{" "}
            <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
              {name}
            </span>
            {" \u2192"}
          </>
        ) : (
          <>
            {promptEn}{" "}
            <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
              {name}
            </span>
            {" \u2192"}
          </>
        )}
      </p>
    </a>
  );
}
