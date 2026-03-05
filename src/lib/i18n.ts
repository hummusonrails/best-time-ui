import type { Translations } from "./types";

export const sharedTranslations: Translations = {
  en: {
    minutes: "min",
    timeSinceLastAlert: "Time Since Last Alert",
    averageGap: "Average Gap (6h)",
    alertCount: "Alerts (24h)",
    trendLabel: "Trend",
    increasing: "Increasing",
    decreasing: "Decreasing",
    stable: "Stable",
    safetyScore: "Safety Score",
    timeline: "24-Hour Alert Timeline",
    howItWorks: "How It Works",
    disclaimer:
      "This is not a substitute for Pikud HaOref guidelines. Always follow official instructions.",
    lastUpdated: "Last updated",
    autoRefresh: "Auto-refreshes every 30s",
    noAlerts: "No recent alerts",
    now: "Now",
    alerts: "alerts",
    searchCity: "Search city...",
    installCTAiOS: "Tap {icon} then \"Add to Home Screen\" — always one tap away",
    installCTAAndroid: "Tap \u22EE then \"Install App\" — always one tap away",
    installCTADesktop: "Install on your phone — always one tap away from a safety check",
    installButton: "Install App",
  },
  he: {
    minutes: "דק׳",
    timeSinceLastAlert: "זמן מאז ההתרעה האחרונה",
    averageGap: "מרווח ממוצע (6 שעות)",
    alertCount: "התרעות (24 שעות)",
    trendLabel: "מגמה",
    increasing: "עולה",
    decreasing: "יורדת",
    stable: "יציבה",
    safetyScore: "ציון בטיחות",
    timeline: "ציר זמן התרעות — 24 שעות",
    howItWorks: "איך זה עובד",
    disclaimer:
      "אפליקציה זו אינה תחליף להנחיות פיקוד העורף. פעלו תמיד לפי ההוראות הרשמיות.",
    lastUpdated: "עודכן לאחרונה",
    autoRefresh: "מתרענן אוטומטית כל 30 שניות",
    noAlerts: "אין התרעות אחרונות",
    now: "עכשיו",
    alerts: "התרעות",
    searchCity: "חפש עיר...",
    installCTAiOS: "לחצו על {icon} ואז \"הוסף למסך הבית\" — תמיד במרחק נגיעה",
    installCTAAndroid: "לחצו על \u22EE ואז \"התקן אפליקציה\" — תמיד במרחק נגיעה",
    installCTADesktop: "התקינו בטלפון — תמיד במרחק נגיעה מבדיקת בטיחות",
    installButton: "התקן אפליקציה",
  },
};

export function mergeTranslations(
  base: Translations,
  overrides: Translations
): Translations {
  return {
    en: { ...base.en, ...overrides.en },
    he: { ...base.he, ...overrides.he },
  };
}
