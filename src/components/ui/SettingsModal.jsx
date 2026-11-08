import React, { useState, useEffect } from "react";
import { t, getLanguageName, getLevelName } from "../../services/i18n";

/**
 * SettingsModal
 * Allows the user to independently switch Interface Language, Learning Language,
 * and Learning Level. Applies changes immediately to the UI and persists to Firestore.
 */
export function SettingsModal(props) {
  if (!props.isOpen) return null;
  return <SettingsModalDialog {...props} />;
}

function SettingsModalDialog({
  onClose,
  initialInterfaceLanguage = "en",
  initialLearningLanguage = "en",
  initialLearningLevel = "beginner",
  onSave
}) {
  const [interfaceLanguage, setInterfaceLanguage] = useState(initialInterfaceLanguage || "en");
  const [learningLanguage, setLearningLanguage] = useState(initialLearningLanguage || "en");
  const [learningLevel, setLearningLevel] = useState(initialLearningLevel || "beginner");
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [feedbackType, setFeedbackType] = useState("success");

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const currentLang = interfaceLanguage; // UI updates immediately as user toggles

  const handleSave = async () => {
    setSaving(true);
    setFeedbackMsg(null);
    try {
      if (onSave) {
        await onSave({
          interfaceLanguage,
          learningLanguage,
          learningLevel
        });
      }
      setFeedbackType("success");
      setFeedbackMsg(t("settings.savedSuccess", {}, interfaceLanguage));
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setFeedbackType("error");
      setFeedbackMsg(t("settings.saveError", {}, interfaceLanguage));
    } finally {
      setSaving(false);
    }
  };

  const INTERFACE_OPTIONS = [
    { id: "en", name: "English (US)", flag: "🇺🇸" },
    { id: "ko", name: "한국어 (Korean)", flag: "🇰🇷" }
  ];

  const LEARNING_OPTIONS = [
    { id: "en", name: getLanguageName("en", currentLang), flag: "🇺🇸" },
    { id: "ko", name: getLanguageName("ko", currentLang), flag: "🇰🇷" }
  ];

  const LEVEL_OPTIONS = [
    { id: "beginner", name: getLevelName("beginner", currentLang) },
    { id: "intermediate", name: getLevelName("intermediate", currentLang) },
    { id: "advanced", name: getLevelName("advanced", currentLang) }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(12px, 3vw, 20px)"
      }}
    >
      <div
        className="modal-scrollable"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #181824 0%, #101018 100%)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "min(680px, calc(100dvh - 32px))",
          overflowY: "auto",
          padding: "clamp(20px, 4vw, 28px) clamp(16px, 4vw, 30px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.3)",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <h2 id="settings-modal-title" style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
            ⚙️ {t("settings.modalTitle", {}, currentLang)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", {}, currentLang)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "#94a3b8",
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "13px",
              background:
                feedbackType === "success"
                  ? "rgba(34, 197, 94, 0.16)"
                  : "rgba(239, 68, 68, 0.16)",
              border:
                feedbackType === "success"
                  ? "1px solid rgba(34, 197, 94, 0.35)"
                  : "1px solid rgba(239, 68, 68, 0.35)",
              color: feedbackType === "success" ? "#86efac" : "#fca5a5"
            }}
          >
            {feedbackType === "success" ? "✓ " : "⚠️ "}
            {feedbackMsg}
          </div>
        )}

        {/* 1. Interface Language Selector */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
            🖥️ {t("settings.interfaceLangLabel", {}, currentLang)}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.35 }}>
            {t("settings.interfaceLangDesc", {}, currentLang)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {INTERFACE_OPTIONS.map((opt) => {
              const active = interfaceLanguage === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setInterfaceLanguage(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: active ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: active ? "rgba(37, 99, 235, 0.22)" : "rgba(255, 255, 255, 0.04)",
                    color: active ? "#93c5fd" : "#cbd5e1",
                    fontWeight: active ? "600" : "400",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{opt.flag}</span>
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Learning Language Selector */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
            🗣️ {t("settings.learningLangLabel", {}, currentLang)}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.35 }}>
            {t("settings.learningLangDesc", {}, currentLang)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {LEARNING_OPTIONS.map((opt) => {
              const active = learningLanguage === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLearningLanguage(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: active ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: active ? "rgba(37, 99, 235, 0.22)" : "rgba(255, 255, 255, 0.04)",
                    color: active ? "#93c5fd" : "#cbd5e1",
                    fontWeight: active ? "600" : "400",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{opt.flag}</span>
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Learning Level Selector */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
            📊 {t("settings.levelLabel", {}, currentLang)}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.35 }}>
            {t("settings.levelDesc", {}, currentLang)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {LEVEL_OPTIONS.map((opt) => {
              const active = learningLevel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLearningLevel(opt.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: active ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: active ? "rgba(37, 99, 235, 0.22)" : "rgba(255, 255, 255, 0.04)",
                    color: active ? "#93c5fd" : "#cbd5e1",
                    fontWeight: active ? "600" : "400",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#cbd5e1",
              fontSize: "13px",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer"
            }}
          >
            {t("common.cancel", {}, currentLang)}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              opacity: saving ? 0.7 : 1,
              transition: "all 0.15s ease"
            }}
          >
            {saving ? t("common.saving", {}, currentLang) : t("settings.saveChangesBtn", {}, currentLang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
