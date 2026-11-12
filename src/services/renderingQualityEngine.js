/**
 * renderingQualityEngine.js
 * Adaptive WebGL Rendering Engine & Dynamic Performance Profiler.
 *
 * Provides tailored performance profiles (Low, Medium, High, Auto)
 * to ensure smooth 30-60 FPS gameplay on low-end smartphones,
 * ordinary Windows notebooks with integrated graphics, and high-end MacBooks.
 */

export const QUALITY_PROFILES = {
  low: {
    id: "low",
    label: "Low (Smooth)",
    labelKo: "낮음 (성능 우선)",
    description: "Optimized for older phones and integrated graphics notebooks",
    dpr: [1, 1],
    shadows: false,
    shadowMapSize: 256,
    fogNear: 80,
    fogFar: 220,
    directionalLightIntensity: 1.15,
    enableShadowAcneFilter: false,
    enableDetailedProps: false,
    targetFps: 30
  },
  medium: {
    id: "medium",
    label: "Medium (Balanced)",
    labelKo: "보통 (균형)",
    description: "Balanced fidelity for modern smartphones and standard laptops",
    dpr: [1, 1.25],
    shadows: true,
    shadowMapSize: 512,
    fogNear: 100,
    fogFar: 300,
    directionalLightIntensity: 1.25,
    enableShadowAcneFilter: true,
    enableDetailedProps: true,
    targetFps: 60
  },
  high: {
    id: "high",
    label: "High (Cinematic)",
    labelKo: "높음 (품질 우선)",
    description: "Full visual fidelity for desktop PCs and Apple Silicon MacBooks",
    dpr: [1, 1.5],
    shadows: true,
    shadowMapSize: 1024,
    fogNear: 100,
    fogFar: 360,
    directionalLightIntensity: 1.3,
    enableShadowAcneFilter: true,
    enableDetailedProps: true,
    targetFps: 60
  }
};

const STORAGE_KEY = "ai_village_render_quality_preference";

/**
 * Detects device hardware capabilities and selects the most appropriate default quality profile.
 *
 * @param {Window} [win]
 * @returns {"low" | "medium" | "high"}
 */
export function detectDeviceInitialQuality(win = typeof window !== "undefined" ? window : null) {
  if (!win) return "medium";

  const cores = win.navigator?.hardwareConcurrency || 4;
  const deviceMemory = win.navigator?.deviceMemory || 4;
  const isTouch = Boolean(
    "ontouchstart" in win ||
      (win.navigator && win.navigator.maxTouchPoints > 0)
  );

  const screenW = win.innerWidth || 1280;
  const screenH = win.innerHeight || 800;
  const isMobileViewport = screenW < 768 || (screenH <= 500 && screenW >= screenH);

  // 1. Mobile devices & small screen touch devices default to 'low' for guaranteed stability & zero freezing
  if (isMobileViewport || (isTouch && (cores <= 4 || deviceMemory <= 3))) {
    return "low";
  }

  // 2. High-performance desktops (8+ CPU cores, 8GB+ memory, non-mobile) default to 'high'
  if (cores >= 8 && deviceMemory >= 8 && !isTouch && screenW >= 1280) {
    return "high";
  }

  // 3. Ordinary notebooks & tablets default to 'medium'
  return "medium";
}

/**
 * Retrieves the user's persisted quality preference from localStorage.
 *
 * @param {Window} [win]
 * @returns {"auto" | "low" | "medium" | "high"}
 */
export function getStoredQualityPreference(win = typeof window !== "undefined" ? window : null) {
  if (!win || !win.localStorage) {
    return "auto";
  }
  try {
    const val = win.localStorage.getItem(STORAGE_KEY);
    if (val && ["auto", "low", "medium", "high"].includes(val)) {
      return val;
    }
  } catch {}
  return "auto";
}

/**
 * Persists the user's selected quality preference.
 *
 * @param {"auto" | "low" | "medium" | "high"} preference
 * @param {Window} [win]
 */
export function setStoredQualityPreference(preference, win = typeof window !== "undefined" ? window : null) {
  if (!win || !win.localStorage) return;
  try {
    if (["auto", "low", "medium", "high"].includes(preference)) {
      win.localStorage.setItem(STORAGE_KEY, preference);
    }
  } catch {}
}

/**
 * Resolves the effective quality configuration based on preference and device signals.
 *
 * @param {"auto" | "low" | "medium" | "high"} [preference]
 * @param {string} [dynamicTierOverride]
 * @returns {typeof QUALITY_PROFILES.low & { activeTier: string, preference: string }}
 */
export function resolveActiveQualityConfig(preference = null, dynamicTierOverride = null) {
  const pref = preference || getStoredQualityPreference();

  let tier = "medium";
  if (dynamicTierOverride && QUALITY_PROFILES[dynamicTierOverride]) {
    tier = dynamicTierOverride;
  } else if (pref === "auto") {
    tier = detectDeviceInitialQuality();
  } else if (QUALITY_PROFILES[pref]) {
    tier = pref;
  }

  const profile = QUALITY_PROFILES[tier] || QUALITY_PROFILES.medium;
  return {
    ...profile,
    activeTier: tier,
    preference: pref
  };
}

/**
 * Dynamic FPS Adapter coordinator.
 * Monitors real-time frame deltas and gracefully adjusts quality tier if performance degrades.
 */
export function createDynamicFpsAdapter({ onQualityChange, initialTier = "medium" }) {
  let currentTier = initialTier;
  let slowFrameCount = 0;
  let fastFrameCount = 0;
  let totalEvaluated = 0;

  return {
    update(deltaSeconds) {
      totalEvaluated++;
      const frameMs = deltaSeconds * 1000;

      // Heavy frame drop (< 24 FPS = > 41.6ms)
      if (frameMs > 41.6) {
        slowFrameCount++;
        fastFrameCount = 0;

        // If 90 slow frames accumulate (approx 3 seconds of sustained stuttering)
        if (slowFrameCount > 90) {
          slowFrameCount = 0;
          if (currentTier === "high") {
            currentTier = "medium";
            onQualityChange?.(currentTier);
          } else if (currentTier === "medium") {
            currentTier = "low";
            onQualityChange?.(currentTier);
          }
        }
      } else if (frameMs < 18.0) {
        // High performance (> 55 FPS)
        fastFrameCount++;
        slowFrameCount = Math.max(0, slowFrameCount - 1);

        // If 600 steady fast frames accumulate (approx 10 seconds of flawless performance)
        if (fastFrameCount > 600) {
          fastFrameCount = 0;
          if (currentTier === "low") {
            currentTier = "medium";
            onQualityChange?.(currentTier);
          }
        }
      }
    },
    getCurrentTier() {
      return currentTier;
    },
    reset(tier) {
      currentTier = tier;
      slowFrameCount = 0;
      fastFrameCount = 0;
    }
  };
}
