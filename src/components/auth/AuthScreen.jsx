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

export function AuthScreen({ user, onAuthSuccess, onSignOut }) {
  // Mode: "login" | "register" | "forgot_password" | "verify_email"
  const [mode, setMode] = useState(user && !user.emailVerified ? "verify_email" : "login");
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
      setErrorMsg("Please enter both email and password.");
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

  // Handle Register (Name, Email, Password - NO confirm-password)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      const newUser = await registerWithEmail(name.trim(), email.trim(), password);
      // Mode switches to verification screen since email/password user needs verification
      setMode("verify_email");
      setInfoMsg("Verification link sent! Please check your email inbox.");
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
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      await sendPasswordReset(email.trim());
      setInfoMsg("Password reset email sent! Check your inbox for instructions.");
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
        setInfoMsg("Email verified successfully! Entering the village...");
        if (onAuthSuccess) onAuthSuccess(refreshedUser);
      } else {
        setErrorMsg("Email not verified yet. Please click the verification link in your email, then click this button again.");
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
      setInfoMsg("Verification email resent! Please check your inbox and spam folder.");
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          background: "rgba(30, 30, 36, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "32px 36px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)",
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
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
              marginBottom: "12px",
              boxShadow: "0 6px 18px rgba(37, 99, 235, 0.45)"
            }}
          >
            🏡
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "#ffffff"
            }}
          >
            AI Language Village
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
              ? "Verify your email to enter the 3D village"
              : mode === "forgot_password"
                ? "Reset your account password"
                : mode === "register"
                  ? "Create your account to start learning"
                  : "Sign in to continue your language journey"}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "18px",
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
              marginBottom: "18px",
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
                Verification Link Sent
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px", wordBreak: "break-all" }}>
                We sent a link to <strong style={{ color: "#60a5fa" }}>{user?.email || email}</strong>. Please check your inbox and confirm your address to enter the village.
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
              {loading ? "Checking status..." : "✓ I've Verified My Email — Enter Village"}
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
              {loading ? "Sending..." : "Resend Verification Email"}
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
              Log out / Use a different account
            </button>
          </div>
        )}

        {/* MODE: Login */}
        {mode === "login" && (
          <div>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
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
                    Password
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
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
              <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>or</span>
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
              Continue with Google
            </button>

            {/* Switch to Register */}
            <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "#94a3b8" }}>
              Don't have an account?{" "}
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
                Sign up
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
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Smith"
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
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
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />
              <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>or</span>
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
              Continue with Google
            </button>

            {/* Switch to Login */}
            <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "#94a3b8" }}>
              Already have an account?{" "}
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
                Log in
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
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
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
                {loading ? "Sending link..." : "Send Reset Link"}
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
                ← Back to Log In
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
        AI-Language-Village • 3D Real-time Spoken English Practice
      </div>
    </div>
  );
}
export default AuthScreen;
