export interface Alert {
  id: string;
  timestamp: number;
  cities: string[];
  threat: number;
  isDrill: boolean;
}

export interface ProcessedAlert {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  cities: string[];
  threat: number;
}

export interface SafetyStats {
  timeSinceLastAlert: number; // minutes
  averageGap: number; // minutes
  alertCount24h: number;
  trend: "increasing" | "decreasing" | "stable";
  safetyScore: number; // 0-100
  lastAlertTime: string | null;
}

export type SafetyLevel = "safe" | "risky" | "dangerous";

export interface SafetyRecommendation {
  level: SafetyLevel;
  score: number;
  message: string;
  messageHe: string;
}

export type Language = "en" | "he";

export type Translations = {
  en: Record<string, string>;
  he: Record<string, string>;
};

export interface PreAlert {
  id: string;
  timestamp: number;
  title_he: string;
  body_he: string;
  city_ids: number[];
  regions: string[];
  alert_type: "early_warning" | "exit_notification";
  created_at: number;
}

export interface PreAlertStatus {
  hasActiveWarning: boolean;
  hasRecentExit: boolean;
  warningCount2h: number;
  warningCount6h: number;
  lastWarningMinutesAgo: number | null;
  lastExitMinutesAgo: number | null;
}
