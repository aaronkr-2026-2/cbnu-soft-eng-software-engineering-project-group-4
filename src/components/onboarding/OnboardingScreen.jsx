import React, { useState } from "react";
import { updateUserProfile } from "../../services/userService";

const LANGUAGES = [
  {
    id: "en",
    name: "English",
    flag: "🇺🇸",
    description: "Practice spoken English with village shopkeepers, doctors, tutors, and residents."
  },
  {
    id: "ko",
    name: "Korean",
    flag: "🇰🇷",
    description: "Explore Korean language essentials and everyday situational conversations."
  }
];

const LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "A1 – A2 Level",
    description: "Simple greetings, basic vocabulary, and short guided sentences with friendly hints."
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "B1 – B2 Level",
    description: "Comfortable with everyday conversations, ordering food, and situational roleplay."
  },
  {
    id: "advanced",
    title: "Advanced",
    subtitle: "C1 – C2 Level",
    description: "Fluent discussions, natural idioms, complex sentence structures, and nuanced feedback."
  }
];

const GOALS = [
  { id: "daily_conversation", label: "Daily conversation & casual chat", icon: "💬" },
  { id: "speaking_pronunciation", label: "Speaking confidence & pronunciation", icon: "🎙️" },
  { id: "work_career", label: "Work, job interviews & career English", icon: "💼" },
  { id: "study_university", label: "Study, campus life & academic discussion", icon: "📚" },
  { id: "travel", label: "Travel, hotel booking & navigation", icon: "✈️" },
  { id: "exam_prep", label: "Exam & test preparation (IELTS, TOEFL, CEFR)", icon: "📝" }
];

export function OnboardingScreen({ user, profile, onComplete, onSignOut }) {
  // Step 1: Language (en | ko)
  // Step 2: Level (beginner | intermediate | advanced)
  // Step 3: Goals (multiple selection, optional)
  const [step, setStep] = useState(1);

  // Selected values
  const [language, setLanguage] = useState(profile?.learningPreferences?.language || "en");
  const [level, setLevel] = useState(profile?.learningPreferences?.level || "intermediate");
  const [selectedGoals, setSelectedGoals] = useState(
    Array.isArray(profile?.learningPreferences?.goals) ? profile.learningPreferences.goals : []
  );

  // Fallback for missing displayName
  const initialName = user?.displayName || profile?.displayName || "";
  const [customName, setCustomName] = useState(initialName);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleGoal = (goalId) => {
    setErrorMsg("");
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!language) {
        setErrorMsg("Please select a language to practice.");
        return;
      }
      if (!initialName && !customName.trim()) {
        setErrorMsg("Please enter a display name to continue.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!level) {
        setErrorMsg("Please select your proficiency level.");
        return;
      }
      setStep(3);
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
      learningPreferences: {
        language,
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

  const currentDisplayName = customName.trim() || user?.displayName || profile?.displayName || "Student";

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
          background: "rgba(30, 30, 38, 0.90)",
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
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#60a5fa", fontWeight: "700" }}>
              Step {step} of 3
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Welcome, <strong style={{ color: "#f8fafc" }}>{currentDisplayName}</strong>
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px", width: "100%", height: "5px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                flex: 1,
                background: step >= 1 ? "#3b82f6" : "transparent",
                transition: "background 0.3s ease"
              }}
            />
            <div
              style={{
                flex: 1,
                background: step >= 2 ? "#3b82f6" : "transparent",
                transition: "background 0.3s ease"
              }}
            />
            <div
              style={{
                flex: 1,
                background: step >= 3 ? "#3b82f6" : "transparent",
                transition: "background 0.3s ease"
              }}
            />
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

        {/* STEP 1: Choose Learning Language */}
        {step === 1 && (
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "21px", fontWeight: "700", color: "#fff" }}>
              What language do you want to learn?
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              Choose your practice language for conversations with village NPCs. (This is separate from the app interface language).
            </p>

            {/* If user lacks display name, allow entering one */}
            {!initialName && (
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter your name"
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
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.id);
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
                        {lang.description}
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

        {/* STEP 2: Choose Proficiency Level */}
        {step === 2 && (
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "21px", fontWeight: "700", color: "#fff" }}>
              Choose your proficiency level
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              Select the level that feels right for you. No placement test is required—you can explore missions at your own pace.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "26px" }}>
              {LEVELS.map((lvl) => {
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
                      {lvl.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Learning Goals (Multi-select, Optional) */}
        {step === 3 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <h2 style={{ margin: 0, fontSize: "21px", fontWeight: "700", color: "#fff" }}>
                What are your main goals?
              </h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Optional</span>
            </div>
            <p style={{ margin: "0 0 18px 0", fontSize: "13px", color: "#94a3b8", lineHeight: 1.4 }}>
              Select any areas you want to prioritize in the village. You can choose multiple or skip this step.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {GOALS.map((g) => {
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
              ← Back
            </button>
          )}

          {step < 3 ? (
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
              Continue →
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
                Skip & Enter
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
                {saving ? "Saving..." : "Finish & Enter Village 🏡"}
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
            Log out / Switch account
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingScreen;
