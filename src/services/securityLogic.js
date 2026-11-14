/**
 * securityLogic.js
 * Centralized, pure utility functions for security hardening,
 * input validation, and development access control.
 */

/**
 * Maximum permitted character length for student/user dialogue input.
 * Protects LLM token budget and mitigates DoS/spend exhaustion attacks.
 */
export const MAX_CHAT_INPUT_LENGTH = 300;

/**
 * Determines whether the ?dev=true authentication bypass is permitted.
 * Strictly blocked in production builds (import.meta.env.DEV must be true).
 *
 * @param {boolean} isDevEnv - Whether the app is running in development mode (e.g. import.meta.env.DEV)
 * @param {string} [search=""] - window.location.search query string
 * @returns {boolean} True if dev authentication bypass is legitimately permitted
 */
export function isDevAuthBypassAllowed(isDevEnv, search = "") {
  // 1. Mandatory guard: Never permit bypass in production environments
  if (!isDevEnv) {
    return false;
  }

  // 2. Query string must be present and contain dev=true
  if (!search || typeof search !== "string") {
    return false;
  }

  try {
    const params = new URLSearchParams(search);
    return params.get("dev") === "true";
  } catch {
    return false;
  }
}

/**
 * Validates, trims, and bounds user text input before passing it to
 * state updates or LLM inference endpoints.
 *
 * @param {unknown} text - Raw input string
 * @param {number} [maxLength=MAX_CHAT_INPUT_LENGTH] - Character threshold
 * @returns {string} Sanitized string strictly bounded by maxLength
 */
export function sanitizeUserInputText(text, maxLength = MAX_CHAT_INPUT_LENGTH) {
  if (typeof text !== "string") {
    return "";
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  const bound = typeof maxLength === "number" && maxLength > 0 ? maxLength : MAX_CHAT_INPUT_LENGTH;
  if (trimmed.length <= bound) {
    return trimmed;
  }

  return trimmed.slice(0, bound);
}

