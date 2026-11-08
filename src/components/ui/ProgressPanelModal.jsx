import React, { useState, useEffect, useCallback, useRef } from "react";
import { getRecentMissionHistory } from "../../services/progressService";
import {
  t,
  resolveUserLanguagePreferences,
  getLanguageName,
  getLevelName
} from "../../services/i18n";

/**
 * Safely formats Firestore Timestamp, JS Date, numeric timestamp, or ISO string.
 * Never throws an error on invalid or missing timestamp.
 *
 * @param {any} ts
 * @returns {string} Formatted date string or "—"
 */
function formatTimestamp(ts) {
  if (!ts) return "—";
  try {
    let date;
    if (typeof ts?.toDate === "function") {
      date = ts.toDate();
    } else if (ts instanceof Date) {
      date = ts;
    } else if (typeof ts === "number") {
      date = new Date(ts);
    } else if (typeof ts?.seconds === "number") {
      date = new Date(ts.seconds * 1000);
    } else if (typeof ts === "string") {
      date = new Date(ts);
    } else {
      return "—";
    }

    if (isNaN(date.getTime())) return "—";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return "—";
  }
}

export function ProgressPanelModal({
  open,
  onClose,
  authUser,
  userProfile,
  interfaceLanguage: propInterfaceLanguage
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeUidRef = useRef(null);
  const previousOpenRef = useRef(false);
  const previousUidRef = useRef(null);

  // Determine active interface and learning languages
  const resolved = resolveUserLanguagePreferences(userProfile);
  const interfaceLang = propInterfaceLanguage || resolved.interfaceLanguage || "en";
  const learningLangId = resolved.learningLanguage;
  const learningLevelId = resolved.learningLevel;

  const interfaceLangRef = useRef(interfaceLang);
  useEffect(() => {
    interfaceLangRef.current = interfaceLang;
  }, [interfaceLang]);

  const fetchHistory = useCallback(async (uid) => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    activeUidRef.current = uid;

    try {
      const records = await getRecentMissionHistory(uid, 5);
      if (activeUidRef.current === uid) {
        setHistory(records);
      }
    } catch (err) {
      if (activeUidRef.current === uid) {
        setError(err?.friendlyMessage || t("stats.errorHistory", {}, interfaceLangRef.current));
      }
    } finally {
      if (activeUidRef.current === uid) {
        setLoading(false);
      }
    }
  }, [interfaceLangRef]);

  // Fetch only when modal transitions from closed to open, or if user changes
  useEffect(() => {
    const currentUid = authUser?.uid;
    if (open && currentUid) {
      if (!previousOpenRef.current || previousUidRef.current !== currentUid) {
        fetchHistory(currentUid);
      }
    }
    previousOpenRef.current = open;
    previousUidRef.current = currentUid;
  }, [open, authUser?.uid, fetchHistory]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.code === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const stats = userProfile?.stats || {};
  const totalXP =
    typeof stats.totalXP === "number" && Number.isFinite(stats.totalXP) ? stats.totalXP : 0;
  const completedMissions =
    typeof stats.completedMissions === "number" && Number.isFinite(stats.completedMissions)
      ? stats.completedMissions
      : 0;
  const totalAttempts =
    typeof stats.totalAttempts === "number" && Number.isFinite(stats.totalAttempts)
      ? stats.totalAttempts
      : 0;
  const averageScore =
    typeof stats.averageScore === "number" && Number.isFinite(stats.averageScore)
      ? stats.averageScore
      : 0;

  const streak = userProfile?.streak || {};
  const currentStreak =
    typeof streak.current === "number" && Number.isFinite(streak.current) && streak.current >= 0
      ? streak.current
      : 0;
  const longestStreak =
    typeof streak.longest === "number" && Number.isFinite(streak.longest) && streak.longest >= 0
      ? streak.longest
      : 0;

  const achievementsData = userProfile?.achievements || {};

  const achievementDefinitions = [
    {
      id: "first_mission",
      title: t("achievements.first_mission.title", {}, interfaceLang),
      subtitle: t("achievements.first_mission.subtitle", {}, interfaceLang),
      icon: "🎯",
      description: t("achievements.first_mission.description", {}, interfaceLang),
      unlocked: Boolean(achievementsData.first_mission?.unlocked) || completedMissions >= 1,
      unlockedAt: achievementsData.first_mission?.unlockedAt,
      progressText: `${Math.min(completedMissions, 1)} / 1`,
      progressPercent: completedMissions >= 1 ? 100 : 0
    },
    {
      id: "xp_500",
      title: t("achievements.xp_500.title", {}, interfaceLang),
      subtitle: t("achievements.xp_500.subtitle", {}, interfaceLang),
      icon: "⚡",
      description: t("achievements.xp_500.description", {}, interfaceLang),
      unlocked: Boolean(achievementsData.xp_500?.unlocked) || totalXP >= 500,
      unlockedAt: achievementsData.xp_500?.unlockedAt,
      progressText: `${Math.min(totalXP, 500)} / 500 XP`,
      progressPercent: Math.min(100, Math.round((Math.min(totalXP, 500) / 500) * 100))
    },
    {
      id: "perfect_score",
      title: t("achievements.perfect_score.title", {}, interfaceLang),
      subtitle: t("achievements.perfect_score.subtitle", {}, interfaceLang),
      icon: "💯",
      description: t("achievements.perfect_score.description", {}, interfaceLang),
      unlocked: Boolean(achievementsData.perfect_score?.unlocked),
      unlockedAt: achievementsData.perfect_score?.unlockedAt,
      progressText: achievementsData.perfect_score?.unlocked ? "100 / 100" : "100 required",
      progressPercent: achievementsData.perfect_score?.unlocked ? 100 : 0
    },
    {
      id: "missions_10",
      title: t("achievements.missions_10.title", {}, interfaceLang),
      subtitle: t("achievements.missions_10.subtitle", {}, interfaceLang),
      icon: "🏅",
      description: t("achievements.missions_10.description", {}, interfaceLang),
      unlocked: Boolean(achievementsData.missions_10?.unlocked) || completedMissions >= 10,
      unlockedAt: achievementsData.missions_10?.unlockedAt,
      progressText: `${Math.min(completedMissions, 10)} / 10`,
      progressPercent: Math.min(100, Math.round((Math.min(completedMissions, 10) / 10) * 100))
    },
    {
      id: "streak_3",
      title: t("achievements.streak_3.title", {}, interfaceLang),
      subtitle: t("achievements.streak_3.subtitle", {}, interfaceLang),
      icon: "🔥",
      description: t("achievements.streak_3.description", {}, interfaceLang),
      unlocked: Boolean(achievementsData.streak_3?.unlocked) || Math.max(currentStreak, longestStreak) >= 3,
      unlockedAt: achievementsData.streak_3?.unlockedAt,
      progressText: `${Math.min(Math.max(currentStreak, longestStreak), 3)} / 3 ${t("hud.streakDays", { count: 3 }, interfaceLang)}`,
      progressPercent: Math.min(100, Math.round((Math.min(Math.max(currentStreak, longestStreak), 3) / 3) * 100))
    }
  ];

  const unlockedCount = achievementDefinitions.filter((a) => a.unlocked).length;

  const displayName =
    userProfile?.displayName || authUser?.displayName || authUser?.email?.split("@")[0] || t("common.student", {}, interfaceLang);
  const learningLangLabel = `${learningLangId === "ko" ? "🇰🇷" : "🇺🇸"} ${getLanguageName(learningLangId, interfaceLang)}`;
  const learningLevelLabel = getLevelName(learningLevelId, interfaceLang);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(10, 15, 29, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#fff"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(24, 24, 32, 0.96)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
              }}
            >
              📊
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "8px", marginTop: "2px" }}>
                <span>{learningLangLabel}</span>
                <span>•</span>
                <span style={{ color: "#60a5fa", fontWeight: "600" }}>{learningLevelLabel}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t("common.close", {}, interfaceLang)}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
              borderRadius: "10px",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {/* Summary Stat Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
              gap: "10px",
              marginBottom: "24px"
            }}
          >
            {/* Total XP Card */}
            <div
              style={{
                background: "rgba(234, 179, 8, 0.08)",
                border: "1px solid rgba(234, 179, 8, 0.25)",
                borderRadius: "14px",
                padding: "12px 10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#fde047", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("stats.totalXpLabel", {}, interfaceLang)}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#fef08a", marginTop: "4px" }}>
                ⚡ {totalXP}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                {t("hud.xpLabel", { count: totalXP }, interfaceLang)}
              </div>
            </div>

            {/* Streak Card */}
            <div
              style={{
                background: "rgba(249, 115, 22, 0.08)",
                border: "1px solid rgba(249, 115, 22, 0.25)",
                borderRadius: "14px",
                padding: "12px 10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#fdba74", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("stats.currentStreakLabel", {}, interfaceLang)}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#fb923c", marginTop: "4px" }}>
                🔥 {currentStreak}d
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                Max: {longestStreak}d
              </div>
            </div>

            {/* Completed Missions Card */}
            <div
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: "14px",
                padding: "12px 10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#86efac", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("stats.completedMissionsLabel", {}, interfaceLang)}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>
                ✅ {completedMissions}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                {t("stats.passBadge", {}, interfaceLang)}
              </div>
            </div>

            {/* Total Attempts Card */}
            <div
              style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                borderRadius: "14px",
                padding: "12px 10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("stats.totalAttemptsLabel", {}, interfaceLang)}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#60a5fa", marginTop: "4px" }}>
                🎯 {totalAttempts}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                {t("common.statistics", {}, interfaceLang)}
              </div>
            </div>

            {/* Average Score Card */}
            <div
              style={{
                background: "rgba(168, 85, 247, 0.08)",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderRadius: "14px",
                padding: "12px 10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600", color: "#d8b4fe", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("stats.averageScoreLabel", {}, interfaceLang)}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#c084fc", marginTop: "4px" }}>
                📈 {averageScore}%
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                {t("stats.scoreDisplay", { score: averageScore }, interfaceLang)}
              </div>
            </div>
          </div>

          {/* Section: Achievements */}
          <div style={{ marginBottom: "26px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
                  🏆 {t("stats.achievementsTitle", {}, interfaceLang)}
                </h3>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 9px",
                  borderRadius: "8px",
                  background: unlockedCount === 5 ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)",
                  color: unlockedCount === 5 ? "#4ade80" : "#fde047",
                  border: unlockedCount === 5 ? "1px solid rgba(34, 197, 94, 0.35)" : "1px solid rgba(234, 179, 8, 0.35)"
                }}
              >
                {t("stats.unlockedCounter", { unlocked: unlockedCount, total: 5 }, interfaceLang)}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {achievementDefinitions.map((ach) => {
                const dateText = ach.unlockedAt ? formatTimestamp(ach.unlockedAt) : null;

                return (
                  <div
                    key={ach.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: ach.unlocked
                        ? "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(234, 179, 8, 0.05))"
                        : "rgba(255, 255, 255, 0.02)",
                      border: ach.unlocked
                        ? "1px solid rgba(34, 197, 94, 0.28)"
                        : "1px solid rgba(255, 255, 255, 0.07)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {/* Achievement Icon */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: ach.unlocked
                          ? "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(234, 179, 8, 0.2))"
                          : "rgba(255, 255, 255, 0.04)",
                        border: ach.unlocked
                          ? "1px solid rgba(34, 197, 94, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                        filter: ach.unlocked ? "none" : "grayscale(80%) opacity(0.6)"
                      }}
                    >
                      {ach.icon}
                    </div>

                    {/* Achievement Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: ach.unlocked ? "#f8fafc" : "#cbd5e1" }}>
                          {ach.title}
                          <span style={{ fontSize: "11px", fontWeight: "500", color: "#94a3b8", marginLeft: "6px" }}>
                            ({ach.subtitle})
                          </span>
                        </div>

                        {/* Status Tag */}
                        {ach.unlocked ? (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#4ade80",
                              background: "rgba(34, 197, 94, 0.15)",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              border: "1px solid rgba(34, 197, 94, 0.3)",
                              flexShrink: 0
                            }}
                          >
                            ✓ {t("stats.passBadge", {}, interfaceLang)}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#94a3b8",
                              background: "rgba(255, 255, 255, 0.05)",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              border: "1px solid rgba(255, 255, 255, 0.09)",
                              flexShrink: 0
                            }}
                          >
                            🔒 {ach.progressText}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", lineHeight: "1.3" }}>
                        {ach.description}
                      </div>

                      {/* Progress Bar (when locked) or Unlock Date (when unlocked) */}
                      {ach.unlocked ? (
                        dateText && dateText !== "—" && (
                          <div style={{ fontSize: "10px", color: "#6ee7b7", marginTop: "4px" }}>
                            📅 {t("stats.attemptDate", { date: dateText }, interfaceLang)}
                          </div>
                        )
                      ) : (
                        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              flex: 1,
                              height: "5px",
                              background: "rgba(255, 255, 255, 0.08)",
                              borderRadius: "3px",
                              overflow: "hidden"
                            }}
                          >
                            <div
                              style={{
                                width: `${ach.progressPercent}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                                borderRadius: "3px",
                                transition: "width 0.3s ease"
                              }}
                            />
                          </div>
                          <span style={{ fontSize: "10px", color: "#94a3b8", minWidth: "30px", textAlign: "right" }}>
                            {ach.progressPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Recent Mission History */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
                {t("stats.recentHistoryTitle", {}, interfaceLang)}
              </h3>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)"
                }}
              >
                <div style={{ fontSize: "26px", marginBottom: "8px" }}>⏳</div>
                <div style={{ fontSize: "14px", color: "#93c5fd", fontWeight: "500" }}>
                  {t("stats.loadingHistory", {}, interfaceLang)}
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div
                style={{
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fca5a5", fontSize: "13px" }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => authUser?.uid && fetchHistory(authUser.uid)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  🔄 {t("common.retry", {}, interfaceLang)}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && history.length === 0 && (
              <div
                style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px dashed rgba(255, 255, 255, 0.12)",
                  borderRadius: "14px"
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "420px", margin: "0 auto", lineHeight: 1.4 }}>
                  {t("stats.emptyHistory", {}, interfaceLang)}
                </div>
              </div>
            )}

            {/* History List */}
            {!loading && !error && history.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {history.map((rec, idx) => {
                  const isCompleted = Boolean(rec.completed);
                  const score = typeof rec.score === "number" ? rec.score : 0;
                  const xp = typeof rec.xpEarned === "number" ? rec.xpEarned : 0;
                  const title = rec.missionTitle || (rec.facility ? `${rec.facility} Mission` : "Village Mission");
                  const dateStr = formatTimestamp(rec.timestamp);

                  return (
                    <div
                      key={rec.id || rec.historyId || `hist_${idx}`}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        transition: "background 0.15s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>
                            {title}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            {rec.facility && <span style={{ color: "#60a5fa" }}>{rec.facility} • </span>}
                            <span>{dateStr}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {/* XP Badge */}
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              background: xp > 0 ? "rgba(234, 179, 8, 0.18)" : "rgba(255, 255, 255, 0.06)",
                              color: xp > 0 ? "#fde047" : "#94a3b8",
                              border: xp > 0 ? "1px solid rgba(234, 179, 8, 0.35)" : "1px solid rgba(255, 255, 255, 0.1)"
                            }}
                          >
                            {t("stats.xpAwarded", { xp }, interfaceLang)}
                          </span>

                          {/* Score Badge */}
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              background:
                                score >= 85
                                  ? "rgba(34, 197, 94, 0.18)"
                                  : score >= 50
                                    ? "rgba(234, 179, 8, 0.18)"
                                    : "rgba(239, 68, 68, 0.18)",
                              color:
                                score >= 85 ? "#86efac" : score >= 50 ? "#fde047" : "#fca5a5"
                            }}
                          >
                            {score}%
                          </span>

                          {/* Status Badge */}
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              background: isCompleted ? "rgba(34, 197, 94, 0.15)" : "rgba(148, 163, 184, 0.15)",
                              color: isCompleted ? "#4ade80" : "#94a3b8"
                            }}
                          >
                            {isCompleted ? t("stats.passBadge", {}, interfaceLang) : t("stats.retryBadge", {}, interfaceLang)}
                          </span>
                        </div>
                      </div>

                      {/* Brief Feedback / Mistakes if available */}
                      {rec.feedback && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#cbd5e1",
                            background: "rgba(0, 0, 0, 0.25)",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            lineHeight: 1.35
                          }}
                        >
                          {rec.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(15, 23, 42, 0.3)"
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {t("common.close", {}, interfaceLang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressPanelModal;
