import React, { useState, useEffect, useCallback, useRef } from "react";
import { getRecentMissionHistory } from "../../services/progressService";

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

export function ProgressPanelModal({ open, onClose, authUser, userProfile }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeUidRef = useRef(null);
  const previousOpenRef = useRef(false);
  const previousUidRef = useRef(null);

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
        setError(err?.friendlyMessage || "Missiya tarixini yuklashda xatolik yuz berdi.");
      }
    } finally {
      if (activeUidRef.current === uid) {
        setLoading(false);
      }
    }
  }, []);

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

  const displayName =
    userProfile?.displayName || authUser?.displayName || authUser?.email?.split("@")[0] || "Student";
  const learningLang =
    userProfile?.learningPreferences?.language === "ko" ? "🇰🇷 Koreys tili" : "🇺🇸 Ingliz tili";
  const learningLevel = userProfile?.learningPreferences?.level
    ? userProfile.learningPreferences.level.charAt(0).toUpperCase() +
      userProfile.learningPreferences.level.slice(1)
    : "Intermediate";

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
                <span>{learningLang}</span>
                <span>•</span>
                <span style={{ color: "#60a5fa", fontWeight: "600" }}>{learningLevel}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
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
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
              marginBottom: "24px"
            }}
          >
            {/* Total XP Card */}
            <div
              style={{
                background: "rgba(234, 179, 8, 0.08)",
                border: "1px solid rgba(234, 179, 8, 0.25)",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#fde047", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Jami XP
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#fef08a", marginTop: "4px" }}>
                ⚡ {totalXP}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                XP ballari
              </div>
            </div>

            {/* Completed Missions Card */}
            <div
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#86efac", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Bajarildi
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>
                ✅ {completedMissions}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                Muvaffaqiyatli
              </div>
            </div>

            {/* Total Attempts Card */}
            <div
              style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Urinishlar
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#60a5fa", marginTop: "4px" }}>
                🎯 {totalAttempts}
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                Jami sessiyalar
              </div>
            </div>

            {/* Average Score Card */}
            <div
              style={{
                background: "rgba(168, 85, 247, 0.08)",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#d8b4fe", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                O‘rtacha Ball
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#c084fc", marginTop: "4px" }}>
                📈 {averageScore}%
              </div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "2px" }}>
                O‘rtacha ko‘rsatkich
              </div>
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
                Oxirgi vazifalar tarixi
              </h3>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                So‘nggi 5 ta yozuv
              </span>
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
                  Missiya tarixi yuklanmoqda...
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
                  🔄 Qayta urinish
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
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#f8fafc", marginBottom: "6px" }}>
                  Hozircha vazifalar bajarilmagan
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "420px", margin: "0 auto", lineHeight: 1.4 }}>
                  Qishloqdagi istalgan binoga (Do‘kon, Qahvaxona, Kutubxona...) kiring, NPC bilan suhbatlashing va birinchi missiyangizni bajaring!
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
                  const title = rec.missionTitle || (rec.facility ? `${rec.facility} Missiyasi` : "Qishloq vazifasi");
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
                            +{xp} XP
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
                            {isCompleted ? "Bajarildi" : "Tugallanmadi"}
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
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressPanelModal;
