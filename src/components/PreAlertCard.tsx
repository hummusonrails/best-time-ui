"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation, useLanguage } from "../lib/I18nContext";
import type { PreAlertStatus, PreAlert } from "../lib/types";

interface PreAlertCardProps {
  preAlertStatus: PreAlertStatus;
  preAlerts: PreAlert[];
}

export default function PreAlertCard({ preAlertStatus, preAlerts }: PreAlertCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const isHe = lang === "he";

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const { warningCount2h, warningCount6h, lastWarningMinutesAgo, hasActiveWarning, hasRecentExit } =
    preAlertStatus;

  if (warningCount6h === 0 && !hasRecentExit) return null;

  const formatTimeAgo = (minutes: number | null): string => {
    if (minutes === null) return "—";
    if (minutes < 1) return isHe ? "עכשיו" : "now";
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  // Determine actual regions from the pre-alert data
  const allRegions = new Set<string>();
  for (const pa of preAlerts) {
    for (const r of pa.regions) allRegions.add(r);
  }
  const hasSpecificRegions = allRegions.size > 0;
  const regionList = Array.from(allRegions).map(r => r.replace(/-/g, " ")).join(", ");

  const severity = hasActiveWarning ? "high" : warningCount2h >= 2 ? "elevated" : "low";

  const getScoreImpact = (): string => {
    if (hasActiveWarning) return t("prealert.scoreImpact.active");
    if (warningCount2h >= 2) return t("prealert.scoreImpact.multi");
    if (hasRecentExit) return t("prealert.scoreImpact.exit");
    return t("prealert.scoreImpact.low");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`w-full px-5 py-3 rounded-xl border transition-colors text-left ${
          severity === "high"
            ? "border-amber-500/40 bg-amber-950/10"
            : severity === "elevated"
            ? "border-amber-500/25 bg-amber-950/5"
            : "border-white/5 bg-white/[0.02]"
        } hover:bg-white/[0.04]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${severity === "low" ? "bg-amber-400/40" : "bg-amber-400"} ${severity === "high" ? "animate-pulse" : ""}`} />
            <span className="font-mono text-sm text-amber-400">
              {warningCount2h > 0 ? warningCount2h : warningCount6h}
            </span>
            <span className="font-mono text-xs opacity-40">
              {warningCount2h > 0 ? t("prealert.warnings2h") : t("prealert.warnings6h")}
            </span>
            {hasRecentExit && (
              <span className="font-mono text-xs text-emerald-400">
                · {t("prealert.cleared")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastWarningMinutesAgo !== null && (
              <span className="font-mono text-xs opacity-25">
                {formatTimeAgo(lastWarningMinutesAgo)} {isHe ? "לפני" : "ago"}
              </span>
            )}
            <span className="font-mono text-[9px] opacity-20">›</span>
          </div>
        </div>
      </button>

      {showModal && portalRoot && createPortal(
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "28rem",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#1a1a1a",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1rem 1rem 0 0",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <h2 style={{ fontFamily: "serif", fontSize: "1.1rem", color: "#f5f0e8", margin: 0 }}>
              {t("prealert.modalTitle")}
            </h2>

            <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.6, margin: 0 }}>
              {t("prealert.modalDesc")}
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { value: warningCount2h, label: isHe ? "2 שעות" : "2 hours", color: "#fbbf24" },
                { value: warningCount6h, label: isHe ? "6 שעות" : "6 hours", color: "rgba(245,240,232,0.5)" },
                { value: hasRecentExit ? "✓" : "—", label: isHe ? "סיום" : "All clear", color: hasRecentExit ? "#34d399" : "rgba(245,240,232,0.2)" },
              ].map((stat, i) => (
                <div key={i} style={{ flex: 1, background: "#252525", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", color: stat.color }}>{stat.value}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,240,232,0.3)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Region context */}
            <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.3)", fontStyle: "italic", textTransform: "capitalize", margin: 0 }}>
              {hasSpecificRegions
                ? `${t("prealert.issuedIn")} ${regionList}`
                : t("prealert.regionNote.nationwide")}
            </p>

            {/* Score impact */}
            <div style={{ background: "rgba(120,53,15,0.15)", border: "1px solid rgba(120,53,15,0.2)", borderRadius: "0.5rem", padding: "0.75rem" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(251,191,36,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
                {t("prealert.scoreImpact")}
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.6)", lineHeight: 1.6, margin: 0 }}>
                {getScoreImpact()}
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                padding: "0.625rem",
                background: "#252525",
                border: "none",
                borderRadius: "0.5rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.4)",
                cursor: "pointer",
              }}
            >
              {t("prealert.close")}
            </button>
          </div>
        </div>,
        portalRoot
      )}
    </>
  );
}
