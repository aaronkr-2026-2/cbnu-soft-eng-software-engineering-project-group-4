import React, { useState } from "react";
import { updateUserProfile } from "../../services/userService";
import { t } from "../../services/i18n";

export function OnboardingScreen({ user, profile, onComplete, onSignOut }) {
  // Step 1: Interface Language (en | ko) + Name
  // Step 2: Learning Language (en | ko)
  // Step 3: Level (beginner | intermediate | advanced)
  // Step 4: Goals (multiple selection, optional)
  const [step, setStep] = useState(1);

  // Language settings: Interface and Learning must remain independent
  const [interfaceLanguage, setInterfaceLanguage] = useState(
    profile?.interfaceLanguage || "en"
  );
  const [learningLanguage, setLearningLanguage] = useState(
    profile?.learningPreferences?.learningLanguage ||
    profile?.learningPreferences?.language ||
    (profile?.interfaceLanguage === "ko" ? "en" : "ko")
  );
  const [level, setLevel] = useState(
    profile?.learningPreferences?.level || "beginner"
  );
  const [selectedGoals, setSelectedGoals] = useState(
    Array.isArray(profile?.learningPreferences?.goals)
      ? profile.learningPreferences.goals
      : []
  );

  // Fallback for missing displayName
  const initialName = user?.displayName || profile?.displayName || "";
  const [customName, setCustomName] = useState(initialName);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const INTERFACE_OPTIONS = [
    {
      id: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      description: "Menus, buttons, instructions, and teacher feedback will be displayed in English."
    },
    {
      id: "ko",
      name: "Korean",
      nativeName: "한국어",
      flag: "🇰🇷",
      description: "메뉴, 버튼, 미션 안내 및 평가 피드백이 한국어로 표시됩니다."
    }
  ];

  const LEARNING_OPTIONS = [
    {
      id: "en",
      flag: "🇺🇸",
      name: t("onboarding.englishLangName", {}, interfaceLanguage),
      desc: t("onboarding.englishLangDesc", {}, interfaceLanguage)
    },
    {
      id: "ko",
      flag: "🇰🇷",
      name: t("onboarding.koreanLangName", {}, interfaceLanguage),
      desc: t("onboarding.koreanLangDesc", {}, interfaceLanguage)
    }
  ];

  const LEVEL_OPTIONS = [
    {
      id: "beginner",
      title: t("onboarding.beginnerTitle", {}, interfaceLanguage),
      subtitle: t("onboarding.beginnerSubtitle", {}, interfaceLanguage),
      desc: t("onboarding.beginnerDesc", {}, interfaceLanguage)
    },
    {
      id: "intermediate",
      title: t("onboarding.intermediateTitle", {}, interfaceLanguage),
      subtitle: t("onboarding.intermediateSubtitle", {}, interfaceLanguage),
      desc: t("onboarding.intermediateDesc", {}, interfaceLanguage)
    },
    {
      id: "advanced",
      title: t("onboarding.advancedTitle", {}, interfaceLanguage),
      subtitle: t("onboarding.advancedSubtitle", {}, interfaceLanguage),
      desc: t("onboarding.advancedDesc", {}, interfaceLanguage)
    }
  ];

  const GOAL_OPTIONS = [
    { id: "daily_conversation", label: t("onboarding.goalDaily", {}, interfaceLanguage), icon: "💬" },
    { id: "speaking_pronunciation", label: t("onboarding.goalSpeaking", {}, interfaceLanguage), icon: "🎙️" },
    { id: "work_career", label: t("onboarding.goalWork", {}, interfaceLanguage), icon: "💼" },
    { id: "study_university", label: t("onboarding.goalStudy", {}, interfaceLanguage), icon: "📚" },
    { id: "travel", label: t("onboarding.goalTravel", {}, interfaceLanguage), icon: "✈️" },
    { id: "exam_prep", label: t("onboarding.goalExam", {}, interfaceLanguage), icon: "📝" }
  ];

  const toggleGoal = (goalId) => {
    setErrorMsg("");
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!interfaceLanguage) {
        setErrorMsg(t("onboarding.errSelectInterface", {}, interfaceLanguage));
        return;
      }
      if (!initialName && !customName.trim()) {
        setErrorMsg(t("onboarding.errEnterName", {}, interfaceLanguage));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!learningLanguage) {
        setErrorMsg(t("onboarding.errSelectLearning", {}, interfaceLanguage));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!level) {
        setErrorMsg(t("onboarding.errSelectLevel", {}, interfaceLanguage));
        return;
      }
      setStep(4);
    }
  };

  const handlePreviousStep = () => {
    setErrorMsg("");
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleFinish = async (skipGoals = false) => {
    if (!user || !user.uid) {
      setErrorMsg("User session not found. Please log in again.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const goalsToSave = skipGoals ? [] : selectedGoals;

    const updates = {
      onboardingCompleted: true,
      interfaceLanguage,
      learningPreferences: {
        language: learningLanguage,
        learningLanguage,
        level,
        goals: goalsToSave
      }
    };

    if (!initialName && customName.trim()) {
      updates.displayName = customName.trim();
    }

    try {
      await updateUserProfile(user.uid, updates);
      const merged = {
        ...profile,
        ...updates
      };
      if (onComplete) {
        onComplete(merged);
      }
    } catch (err) {
      console.error("Failed to save onboarding data:", err);
      setErrorMsg(err.friendlyMessage || "Could not save learning preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayName = customName.trim() || user?.displayName || profile?.displayName || t("common.student", {}, interfaceLanguage);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 100,
        background: "radial-gradient(ellipse at 50% 25%, #1e293b 0%, #0f172a 65%, #020617 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#fff"
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none"
        }}
      />

      {/* Main Glassmorphic Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          background: "rgba(30, 30, 38, 0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "22px",
          padding: "32px 34px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.2)",
          zIndex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Top Stepper Indicator */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#60a5fa", fontWeight: "700" }}>
              {t("onboarding.stepIndicator", { current: step, total: 4 }, interfaceLanguage)}
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              {t("onboarding.welcomeStudent", { name: currentDisplayName }, interfaceLanguage)}
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px", width: "100%", height: "5px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "3px", overflow: "hidden" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: step >= i ? "#3b82f6" : "transparent",
                  transition: "background 0.3s ease"
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "18px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#fca5a5",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Choose Interface Language */}
        {step === 1 && (
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "21px", fontWeight: "700", color: "#fff" }}>
              {t("onboarding.interfaceLangTitle", {}, interfaceLanguage)}
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              {t("onboarding.interfaceLangSubtitle", {}, interfaceLanguage)}
            </p>

            {/* If user lacks display name, allow entering one */}
            {!initialName && (
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("onboarding.namePrompt", {}, interfaceLanguage)}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={t("onboarding.namePlaceholder", {}, interfaceLanguage)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(15, 23, 42, 0.6)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "26px" }}>
              {INTERFACE_OPTIONS.map((opt) => {
                const isSelected = interfaceLanguage === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setInterfaceLanguage(opt.id);
                      setErrorMsg("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected ? "rgba(37, 99, 235, 0.16)" : "rgba(255, 255, 255, 0.04)",
                      boxShadow: isSelected ? "0 4px 18px rgba(37, 99, 235, 0.25)" : "none",
                      color: "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "32px" }}>{opt.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: isSelected ? "#93c5fd" : "#f8fafc" }}>
                        {opt.nativeName} ({opt.name})
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px", lineHeight: 1.35 }}>
                        {opt.description}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "bold" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Choose Learning Language */}
        {step === 2 && (
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "21px", fontWeight: "700", color: "#fff" }}>
              {t("onboarding.learningLangTitle", {}, interfaceLanguage)}
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              {t("onboarding.learningLangSubtitle", {}, interfaceLanguage)}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "26px" }}>
              {LEARNING_OPTIONS.map((lang) => {
                const isSelected = learningLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setLearningLanguage(lang.id);
                      setErrorMsg("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected ? "rgba(37, 99, 235, 0.16)" : "rgba(255, 255, 255, 0.04)",
                      boxShadow: isSelected ? "0 4px 18px rgba(37, 99, 235, 0.25)" : "none",
                      color: "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "32px" }}>{lang.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: isSelected ? "#93c5fd" : "#f8fafc" }}>
                        {lang.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px", lineHeight: 1.35 }}>
                        {lang.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "bold" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Proficiency Level */}
        {step === 3 && (
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "21px", fontWeight: "700", color: "#fff" }}>
              {t("onboarding.levelTitle", {}, interfaceLanguage)}
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              {t("onboarding.levelSubtitle", {}, interfaceLanguage)}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "26px" }}>
              {LEVEL_OPTIONS.map((lvl) => {
                const isSelected = level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      setLevel(lvl.id);
                      setErrorMsg("");
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected ? "rgba(37, 99, 235, 0.16)" : "rgba(255, 255, 255, 0.04)",
                      boxShadow: isSelected ? "0 4px 18px rgba(37, 99, 235, 0.25)" : "none",
                      color: "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: isSelected ? "#93c5fd" : "#f8fafc" }}>
                        {lvl.title}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#60a5fa", background: "rgba(37, 99, 235, 0.2)", padding: "2px 8px", borderRadius: "10px" }}>
                        {lvl.subtitle}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.35 }}>
                      {lvl.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Choose Learning Goals (Multi-select, Optional) */}
        {step === 4 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <h2 style={{ margin: 0, fontSize: "21px", fontWeight: "700", color: "#fff" }}>
                {t("onboarding.goalsTitle", {}, interfaceLanguage)}
              </h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {t("onboarding.optionalBadge", {}, interfaceLanguage)}
              </span>
            </div>
            <p style={{ margin: "0 0 18px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              {t("onboarding.goalsSubtitle", {}, interfaceLanguage)}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {GOAL_OPTIONS.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isSelected ? "rgba(37, 99, 235, 0.22)" : "rgba(255, 255, 255, 0.04)",
                      color: isSelected ? "#93c5fd" : "#cbd5e1",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: isSelected ? "600" : "400",
                      lineHeight: 1.3,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{g.icon}</span>
                    <span style={{ flex: 1 }}>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons (Back, Continue, Finish) */}
        <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
          {step > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              disabled={saving}
              style={{
                flex: "0 0 100px",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "#cbd5e1",
                fontSize: "14px",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer"
              }}
            >
              ← {t("common.back", {}, interfaceLanguage)}
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                transition: "all 0.15s ease"
              }}
            >
              {t("common.continue", {}, interfaceLanguage)} →
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px", flex: 1 }}>
              <button
                type="button"
                onClick={() => handleFinish(true)}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {t("common.skip", {}, interfaceLanguage)}
              </button>

              <button
                type="button"
                onClick={() => handleFinish(false)}
                disabled={saving}
                style={{
                  flex: 1.5,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                {saving ? t("common.saving", {}, interfaceLanguage) : t("common.finish", {}, interfaceLanguage)}
              </button>
            </div>
          )}
        </div>

        {/* Sign Out link */}
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button
            type="button"
            onClick={onSignOut}
            disabled={saving}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "12px",
              cursor: saving ? "not-allowed" : "pointer",
              textDecoration: "underline"
            }}
          >
            {t("auth.signOutSwitchAccount", {}, interfaceLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingScreen;
