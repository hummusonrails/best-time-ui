import { ProcessedAlert, SafetyStats, PreAlert, PreAlertStatus } from "./types";

export function computeStats(alerts: ProcessedAlert[]): SafetyStats {
  const now = Date.now();

  if (alerts.length === 0) {
    return {
      timeSinceLastAlert: Infinity,
      averageGap: Infinity,
      alertCount24h: 0,
      trend: "stable",
      safetyScore: 95,
      lastAlertTime: null,
    };
  }

  const sorted = [...alerts].sort((a, b) => b.timestamp - a.timestamp);

  const timeSinceLastAlert = (now - sorted[0].timestamp) / (1000 * 60);

  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  const recent24h = sorted.filter((a) => a.timestamp > twentyFourHoursAgo);
  const alertCount24h = recent24h.length;

  const sixHoursAgo = now - 6 * 60 * 60 * 1000;
  const recent6h = sorted.filter((a) => a.timestamp > sixHoursAgo);
  let averageGap = Infinity;
  if (recent6h.length > 1) {
    const gaps: number[] = [];
    for (let i = 0; i < recent6h.length - 1; i++) {
      gaps.push((recent6h[i].timestamp - recent6h[i + 1].timestamp) / (1000 * 60));
    }
    averageGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  }

  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (recent24h.length >= 4) {
    const mid = Math.floor(recent24h.length / 2);
    const recentHalf = recent24h.slice(0, mid);
    const olderHalf = recent24h.slice(mid);

    const recentSpan = recentHalf.length > 1
      ? (recentHalf[0].timestamp - recentHalf[recentHalf.length - 1].timestamp) / (1000 * 60 * 60)
      : 1;
    const olderSpan = olderHalf.length > 1
      ? (olderHalf[0].timestamp - olderHalf[olderHalf.length - 1].timestamp) / (1000 * 60 * 60)
      : 1;

    const recentRate = recentHalf.length / Math.max(recentSpan, 0.5);
    const olderRate = olderHalf.length / Math.max(olderSpan, 0.5);

    if (recentRate > olderRate * 1.3) trend = "increasing";
    else if (recentRate < olderRate * 0.7) trend = "decreasing";
  }

  const safetyScore = calculateSafetyScore(
    timeSinceLastAlert,
    averageGap,
    trend,
    alertCount24h
  );

  const lastDate = new Date(sorted[0].timestamp);
  const today = new Date();
  const isToday = lastDate.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = lastDate.toDateString() === yesterday.toDateString();

  const timeStr = lastDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let lastAlertTime: string;
  if (isToday) {
    lastAlertTime = timeStr;
  } else if (isYesterday) {
    lastAlertTime = `Yesterday ${timeStr}`;
  } else {
    const dateStr = lastDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    lastAlertTime = `${dateStr}, ${timeStr}`;
  }

  return {
    timeSinceLastAlert,
    averageGap,
    alertCount24h,
    trend,
    safetyScore,
    lastAlertTime,
  };
}

export function computePreAlertStatus(
  preAlerts: PreAlert[],
  regionId?: string | null
): PreAlertStatus {
  const now = Date.now();
  const thirtyMin = 30 * 60 * 1000;
  const twoHours = 2 * 60 * 60 * 1000;
  const sixHours = 6 * 60 * 60 * 1000;

  const filtered = preAlerts.filter((pa) => {
    if (!regionId) return true;
    if (pa.regions.length === 0) return true;
    return pa.regions.includes(regionId);
  });

  const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

  const warnings = sorted.filter((pa) => pa.alert_type === "early_warning");
  const exits = sorted.filter((pa) => pa.alert_type === "exit_notification");

  const lastWarning = warnings.length > 0 ? warnings[0] : null;
  const lastExit = exits.length > 0 ? exits[0] : null;

  const lastWarningMinutesAgo = lastWarning
    ? (now - lastWarning.timestamp) / (1000 * 60)
    : null;
  const lastExitMinutesAgo = lastExit
    ? (now - lastExit.timestamp) / (1000 * 60)
    : null;

  const hasActiveWarning =
    lastWarning !== null && now - lastWarning.timestamp <= thirtyMin;

  const hasRecentExit =
    lastExit !== null &&
    now - lastExit.timestamp <= thirtyMin &&
    (lastWarning === null || lastExit.timestamp > lastWarning.timestamp);

  const warningCount2h = warnings.filter(
    (pa) => now - pa.timestamp <= twoHours
  ).length;

  const warningCount6h = warnings.filter(
    (pa) => now - pa.timestamp <= sixHours
  ).length;

  return {
    hasActiveWarning,
    hasRecentExit,
    warningCount2h,
    warningCount6h,
    lastWarningMinutesAgo,
    lastExitMinutesAgo,
  };
}

export function calculateSafetyScore(
  timeSinceLastAlert: number,
  averageGap: number,
  trend: "increasing" | "decreasing" | "stable",
  alertCount24h: number,
  preAlertStatus?: PreAlertStatus
): number {
  const timeScore = Math.min(100, (timeSinceLastAlert / 60) * 100);
  const gapScore = averageGap === Infinity ? 100 : Math.min(100, (averageGap / 60) * 100);
  const trendScore = trend === "decreasing" ? 80 : trend === "stable" ? 50 : 20;
  const freqScore = Math.max(0, 100 - alertCount24h * 5);

  if (!preAlertStatus) {
    const weighted =
      timeScore * 0.4 + gapScore * 0.25 + trendScore * 0.2 + freqScore * 0.15;
    return Math.round(Math.max(0, Math.min(100, weighted)));
  }

  let preAlertScore: number;
  if (preAlertStatus.hasActiveWarning) {
    preAlertScore = 20;
  } else if (preAlertStatus.warningCount2h >= 2) {
    preAlertScore = 40;
  } else if (preAlertStatus.warningCount6h >= 3) {
    preAlertScore = 60;
  } else if (preAlertStatus.hasRecentExit) {
    preAlertScore = 100;
  } else {
    preAlertScore = 80;
  }

  let weighted =
    timeScore * 0.35 +
    gapScore * 0.2 +
    trendScore * 0.15 +
    freqScore * 0.1 +
    preAlertScore * 0.2;

  if (preAlertStatus.hasRecentExit && !preAlertStatus.hasActiveWarning) {
    weighted = Math.min(100, weighted + 7);
  }

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function formatDuration(minutes: number): string {
  if (minutes === Infinity) return "N/A";
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
