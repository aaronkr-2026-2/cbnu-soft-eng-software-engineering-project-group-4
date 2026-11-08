import React, { useState } from "react";
import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  sendVerificationEmail,
  reloadUser,
  signOutUser,
  formatAuthError
} from "../../services/auth";
import { t } from "../../services/i18n";

export function AuthScreen({ user, onAuthSuccess, onSignOut, initialInterfaceLanguage = "en" }) {
  // Mode: "login" | "register" | "forgot_password" | "verify_email"
  const [mode, setMode] = useState(user && !user.emailVerified ? "verify_email" : "login");
  const [interfaceLanguage, setInterfaceLanguage] = useState(initialInterfaceLanguage || "en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const clearMessages = () => {
    setErrorMsg("");
    setInfoMsg("");
  };

  const switchMode = (newMode) => {
    clearMessages();
    setMode(newMode);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg(t("auth.missingCredentials", {}, interfaceLanguage));
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      const loggedUser = await signInWithEmail(email.trim(), password);
      if (onAuthSuccess) onAuthSuccess(loggedUser);
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Register (Name, Email, Password)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(t("auth.missingName", {}, interfaceLanguage));
      return;
    }
    if (!email.trim()) {
      setErrorMsg(t("auth.missingEmail", {}, interfaceLanguage));
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg(t("auth.weakPassword", {}, interfaceLanguage));
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      const newUser = await registerWithEmail(name.trim(), email.trim(), password);
      setMode("verify_email");
      setInfoMsg(t("auth.verifSentNotice", {}, interfaceLanguage));
      if (onAuthSuccess) onAuthSuccess(newUser);
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);

    try {
      const googleUser = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(googleUser);
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(t("auth.missingEmail", {}, interfaceLanguage));
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      await sendPasswordReset(email.trim());
      setInfoMsg(t("auth.resetSentNotice", {}, interfaceLanguage));
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Verification Refresh
  const handleCheckVerification = async () => {
    clearMessages();
    setLoading(true);

    try {
      const refreshedUser = await reloadUser(user);
      if (refreshedUser && refreshedUser.emailVerified) {
        setInfoMsg(t("auth.emailVerifiedSuccess", {}, interfaceLanguage));
        if (onAuthSuccess) onAuthSuccess(refreshedUser);
      } else {
        setErrorMsg(t("auth.emailNotVerifiedYet", {}, interfaceLanguage));
      }
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Verification Email
  const handleResendVerification = async () => {
    clearMessages();
    setLoading(true);

    try {
      await sendVerificationEmail(user);
      setInfoMsg(t("auth.verifSentNotice", {}, interfaceLanguage));
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Out from Auth Screen
  const handleSignOut = async () => {
    clearMessages();
    setLoading(true);
    try {
      await signOutUser();
      switchMode("login");
      if (onSignOut) onSignOut();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        zIndex: 100,
        background: "radial-gradient(ellipse at 50% 25%, #1e293b 0%, #0f172a 65%, #020617 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "clamp(12px, 3vw, 20px)",
        overflowY: "auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#fff"
      }}
    >
      {/* Background Decorative Village Glow */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0) 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }}
      />

      {/* Main Glassmorphic Card */}
      <div
        className="modal-scrollable"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "min(720px, calc(100dvh - 24px))",
          overflowY: "auto",
          background: "rgba(30, 30, 36, 0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "clamp(20px, 4vw, 30px) clamp(16px, 4vw, 34px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)",
          zIndex: 1
        }}
      >
        {/* Language Quick Switcher */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <button
              type="button"
              onClick={() => setInterfaceLanguage("en")}
              style={{
                background: interfaceLanguage === "en" ? "#2563eb" : "transparent",
                color: interfaceLanguage === "en" ? "#fff" : "#94a3b8",
                border: "none",
                borderRadius: "18px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => setInterfaceLanguage("ko")}
              style={{
                background: interfaceLanguage === "ko" ? "#2563eb" : "transparent",
                color: interfaceLanguage === "ko" ? "#fff" : "#94a3b8",
                border: "none",
                borderRadius: "18px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              🇰🇷 KO
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              fontSize: "26px",
              marginBottom: "10px",
              boxShadow: "0 6px 18px rgba(37, 99, 235, 0.45)"
            }}
          >
            🏡
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "#ffffff"
            }}
          >
            {t("auth.brandTitle", {}, interfaceLanguage)}
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.4
            }}
          >
            {mode === "verify_email"
              ? t("auth.verifyEmailSubtitle", {}, interfaceLanguage)
              : mode === "forgot_password"
                ? t("auth.resetPasswordSubtitle", {}, interfaceLanguage)
                : mode === "register"
                  ? t("auth.createAccountSubtitle", {}, interfaceLanguage)
                  : t("auth.welcomeBack", {}, interfaceLanguage)}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.14)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#fca5a5",
              fontSize: "13px",
              lineHeight: 1.4,
              display: "flex",
              alignItems: "flex-start",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "15px" }}>⚠️</span>
            <span style={{ flex: 1 }}>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(34, 197, 94, 0.14)",
              border: "1px solid rgba(34, 197, 94, 0.35)",
              color: "#86efac",
              fontSize: "13px",
              lineHeight: 1.4,
              display: "flex",
              alignItems: "flex-start",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "15px" }}>✓</span>
            <span style={{ flex: 1 }}>{infoMsg}</span>
          </div>
        )}

        {/* MODE: Email Verification Screen */}
        {mode === "verify_email" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "18px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "20px"
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📬</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>
                {t("auth.verifSentNotice", {}, interfaceLanguage)}
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px", wordBreak: "break-all" }}>
                <strong style={{ color: "#60a5fa" }}>{user?.email || email}</strong>
              </div>
            </div>

            <button
              onClick={handleCheckVerification}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                marginBottom: "10px",
                transition: "all 0.15s ease"
              }}
            >
              {loading ? t("common.loading", {}, interfaceLanguage) : `✓ ${t("auth.checkVerificationBtn", {}, interfaceLanguage)}`}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#cbd5e1",
                fontWeight: "500",
                fontSize: "13px",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "12px"
              }}
            >
              {loading ? t("common.loading", {}, interfaceLanguage) : t("auth.resendVerificationBtn", {}, interfaceLanguage)}
            </button>

            <button
              onClick={handleSignOut}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              {t("auth.signOutSwitchAccount", {}, interfaceLanguage)}
            </button>
          </div>
        )}

        {/* MODE: Login */}
        {mode === "login" && (
          <div>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("auth.emailLabel", {}, interfaceLanguage)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1" }}>
                    {t("auth.passwordLabel", {}, interfaceLanguage)}
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot_password")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#60a5fa",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    {t("auth.forgotPasswordLink", {}, interfaceLanguage)}
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "6px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                {loading ? t("common.loading", {}, interfaceLanguage) : t("auth.signInBtn", {}, interfaceLanguage)}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {t("auth.orDivider", {}, interfaceLanguage)}
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "#f8fafc",
                fontWeight: "500",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              {t("auth.googleSignInBtn", {}, interfaceLanguage)}
            </button>

            {/* Switch to Register */}
            <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "#94a3b8" }}>
              {t("auth.noAccountPrompt", {}, interfaceLanguage)}{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                {t("auth.signUpLink", {}, interfaceLanguage)}
              </button>
            </div>
          </div>
        )}

        {/* MODE: Register */}
        {mode === "register" && (
          <div>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("auth.nameLabel", {}, interfaceLanguage)}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.namePlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("auth.emailLabel", {}, interfaceLanguage)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("auth.passwordLabel", {}, interfaceLanguage)}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "6px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                {loading ? t("common.loading", {}, interfaceLanguage) : t("auth.signUpBtn", {}, interfaceLanguage)}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {t("auth.orDivider", {}, interfaceLanguage)}
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "#f8fafc",
                fontWeight: "500",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              {t("auth.googleSignInBtn", {}, interfaceLanguage)}
            </button>

            {/* Switch to Login */}
            <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "#94a3b8" }}>
              {t("auth.haveAccountPrompt", {}, interfaceLanguage)}{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                {t("auth.signInLink", {}, interfaceLanguage)}
              </button>
            </div>
          </div>
        )}

        {/* MODE: Forgot Password */}
        {mode === "forgot_password" && (
          <div>
            <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  {t("auth.emailLabel", {}, interfaceLanguage)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder", {}, interfaceLanguage)}
                  disabled={loading}
                  required
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "6px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                {loading ? t("common.loading", {}, interfaceLanguage) : t("auth.resetPasswordBtn", {}, interfaceLanguage)}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => switchMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                {t("auth.backToLogin", {}, interfaceLanguage)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.4)",
          textAlign: "center"
        }}
      >
        AI-Language-Village • {t("auth.brandSubtitle", {}, interfaceLanguage)}
      </div>
    </div>
  );
}

export default AuthScreen;
