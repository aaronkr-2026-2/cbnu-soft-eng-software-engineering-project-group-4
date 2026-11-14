import React, { useState, useEffect } from "react";
import { t, getLanguageName, getLevelName } from "../../services/i18n";
import { getStoredQualityPreference, setStoredQualityPreference } from "../../services/renderingQualityEngine";

/**
 * SettingsModal
 * Allows the user to independently switch Interface Language, Learning Language,
 * Learning Level, and 3D Graphics Rendering Quality (Auto, Low, Medium, High).
 * Applies changes immediately to the UI and persists to storage.
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
  initialQualityPreference = null,
  onSave
}) {
  const [interfaceLanguage, setInterfaceLanguage] = useState(initialInterfaceLanguage || "en");
  const [learningLanguage, setLearningLanguage] = useState(initialLearningLanguage || "en");
  const [learningLevel, setLearningLevel] = useState(initialLearningLevel || "beginner");
  const [qualityPreference, setQualityPreference] = useState(
    initialQualityPreference || getStoredQualityPreference()
  );
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
      setStoredQualityPreference(qualityPreference);
      if (onSave) {
        await onSave({
          interfaceLanguage,
          learningLanguage,
          learningLevel,
          qualityPreference
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

  const QUALITY_OPTIONS = [
    { id: "auto", name: currentLang === "ko" ? "⚡ 자동 (권장)" : "⚡ Auto (Adaptive)", desc: currentLang === "ko" ? "기기 성능에 맞춤" : "Adapts to device" },
    { id: "low", name: currentLang === "ko" ? "🚀 낮음 (원활)" : "🚀 Low (Smooth)", desc: currentLang === "ko" ? "스마트폰 & 저사양용" : "For phones & laptops" },
    { id: "medium", name: currentLang === "ko" ? "⚖️ 보통 (균형)" : "⚖️ Medium (Balanced)", desc: currentLang === "ko" ? "부드러운 표준 품질" : "Standard balanced" },
    { id: "high", name: currentLang === "ko" ? "✨ 높음 (고화질)" : "✨ High (Cinematic)", desc: currentLang === "ko" ? "풀 그래픽 & 그림자" : "Full fidelity & shadows" }
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
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90dvh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55)",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 id="settings-modal-title" style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
            ⚙️ {t("settings.title", {}, currentLang)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", {}, currentLang)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "#94a3b8",
              fontSize: "18px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
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
            role="status"
            aria-live="polite"
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontSize: "13px",
              background: feedbackType === "success" ? "rgba(34, 197, 94, 0.18)" : "rgba(239, 68, 68, 0.18)",
              border: feedbackType === "success" ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
              color: feedbackType === "success" ? "#86efac" : "#fca5a5"
            }}
          >
            {feedbackMsg}
          </div>
        )}

        {/* 1. Interface Language Selector */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
            🌐 {t("settings.interfaceLangLabel", {}, currentLang)}
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
        <div style={{ marginBottom: "20px" }}>
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
        <div style={{ marginBottom: "20px" }}>
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

        {/* 4. 3D Graphics & Rendering Performance Profile */}
        <div style={{ marginBottom: "26px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
            🎮 {currentLang === "ko" ? "3D 그래픽 및 성능 품질" : "3D Graphics & Performance"}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.35 }}>
            {currentLang === "ko"
              ? "기기 성능에 맞게 렌더링 해상도와 그림자 설정을 조정합니다."
              : "Adjust resolution and shadows for smooth 60 FPS on your hardware."}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {QUALITY_OPTIONS.map((opt) => {
              const active = qualityPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQualityPreference(opt.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    textAlign: "left",
                    border: active ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: active ? "rgba(37, 99, 235, 0.22)" : "rgba(255, 255, 255, 0.04)",
                    color: active ? "#93c5fd" : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontWeight: active ? "600" : "500", fontSize: "12px" }}>
                    {opt.name}
                  </div>
                  <div style={{ fontSize: "10px", color: active ? "#bfdbfe" : "#64748b", marginTop: "2px" }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy & AI Processing Disclosure */}
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            fontSize: "11px",
            color: "#94a3b8",
            lineHeight: 1.4
          }}
        >
          <div style={{ fontWeight: 600, color: "#cbd5e1", marginBottom: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🔒</span>
            <span>{currentLang === "ko" ? "개인정보 보호 및 AI 처리 안내" : "Privacy & AI Processing Notice"}</span>
          </div>
          <div>
            {currentLang === "ko"
              ? "학습자의 음성 대화 텍스트는 상황별 NPC 대화 및 미션 평가를 위해 안전한 백엔드 프록시(/api/chat)를 거쳐 Groq Cloud AI로 전송됩니다. API 키는 브라우저에 노출되지 않으며, 서버에서만 안전하게 관리됩니다."
              : "Spoken dialogue transcripts are securely processed via our backend proxy (/api/chat) by Groq Cloud AI for NPC dialogue and mission evaluation. No API secrets are exposed to or stored in your browser."}
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
