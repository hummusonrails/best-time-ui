"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language, Translations } from "./types";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
  t: (key) => key,
});

interface I18nProviderProps {
  translations: Translations;
  storageKey?: string;
  children: ReactNode;
}

export function I18nProvider({
  translations,
  storageKey = "lang",
  children,
}: I18nProviderProps) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as Language | null;
    if (saved === "en" || saved === "he") {
      setLangState(saved);
    }
  }, [storageKey]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(storageKey, newLang);
  };

  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = (key: string) => translations[lang]?.[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  const { lang, setLang, dir } = useContext(I18nContext);
  return { lang, setLang, dir };
}

export function useTranslation() {
  const { t, lang } = useContext(I18nContext);
  return { t, lang };
}
