// Components
export { default as Header } from "./components/Header";
export { default as Footer } from "./components/Footer";
export { default as CrossPromoBanner } from "./components/CrossPromoBanner";
export { default as SafetyVerdict } from "./components/SafetyVerdict";
export { default as StatsGrid } from "./components/StatsGrid";
export { default as AlertTimeline } from "./components/AlertTimeline";
export { default as ScrollReveal } from "./components/ScrollReveal";
export { default as HowItWorks } from "./components/HowItWorks";
export { default as InstallPrompt } from "./components/InstallPrompt";

// Hooks
export { useCountUp } from "./hooks/useCountUp";
export { default as useDeviceType } from "./hooks/useDeviceType";
export { useScrollReveal } from "./hooks/useScrollReveal";

// Context & i18n
export { I18nProvider, useLanguage, useTranslation } from "./lib/I18nContext";
export { sharedTranslations, mergeTranslations } from "./lib/i18n";

// Lib
export { useHaptics } from "./lib/haptics";
export { computeStats, calculateSafetyScore, formatDuration } from "./lib/safety";
export { regions, detectRegionFromCoordinates, filterAlertsByRegion } from "./lib/regions";

// Types
export type {
  Alert,
  ProcessedAlert,
  SafetyStats,
  SafetyLevel,
  SafetyRecommendation,
  Language,
  Translations,
} from "./lib/types";
export type { Region } from "./lib/regions";
