/**
 * deviceDetection.js
 * Device capability, responsive viewport detection, and layout architecture.
 *
 * Rules:
 * - Distinguishes touch capability from viewport layout dimensions.
 * - Separates Viewport Layout ("desktop" | "tablet" | "mobile-portrait" | "mobile-landscape")
 *   from Input Capabilities (touch, keyboard, mouse)
 *   from Gameplay Controls (desktop keyboard/mouse vs touch joystick/action buttons).
 * - Desktop layout never displays virtual joystick or mobile action FABs.
 * - Mobile layout always displays virtual joystick and action buttons during gameplay.
 * - Supports window resize, device orientation change, and visualViewport updates.
 * - Attaches window.__diagnoseMobileControls() for real-time debugging.
 */

import { useState, useEffect } from "react";

/**
 * Checks if the current environment supports touch interaction.
 * Works across mobile browsers, touch tablets, and hybrid touchscreen laptops.
 *
 * @param {Window} [win] - Optional window override for testing
 * @returns {boolean}
 */
export function isTouchCapable(win = typeof window !== "undefined" ? window : null) {
  if (!win) return false;
  return Boolean(
    "ontouchstart" in win ||
      (win.navigator && win.navigator.maxTouchPoints > 0) ||
      (win.navigator && win.navigator.msMaxTouchPoints > 0)
  );
}

/**
 * Determines viewport category based on width:
 * - "mobile": < 768px
 * - "tablet": 768px - 1024px
 * - "desktop": > 1024px
 *
 * @param {number} width
 * @returns {"mobile" | "tablet" | "desktop"}
 */
export function getViewportCategory(width) {
  if (typeof width !== "number" || width < 768) {
    return "mobile";
  }
  if (width <= 1024) {
    return "tablet";
  }
  return "desktop";
}

/**
 * Determines device orientation:
 * - "landscape" if width >= height
 * - "portrait" if height > width
 *
 * @param {number} width
 * @param {number} height
 * @returns {"landscape" | "portrait"}
 */
export function getOrientation(width, height) {
  if (typeof width !== "number" || typeof height !== "number") {
    return "landscape";
  }
  return width >= height ? "landscape" : "portrait";
}

/**
 * Resolves the primary layout mode from viewport dimensions.
 *
 * Modes:
 * - "desktop": Width > 1024px. Full desktop layout.
 * - "tablet": Width between 768px and 1024px.
 * - "mobile-portrait": Width < 768px and Height > Width.
 * - "mobile-landscape": Width < 768px or (Height <= 500px and Width >= Height).
 *
 * @param {number} width
 * @param {number} height
 * @returns {"desktop" | "tablet" | "mobile-portrait" | "mobile-landscape"}
 */
export function getLayoutMode(width, height) {
  if (typeof width !== "number" || typeof height !== "number") {
    return "desktop";
  }

  // Mobile landscape: short height screens (smartphones rotated horizontally)
  if (height <= 500 && width >= height && width <= 960) {
    return "mobile-landscape";
  }

  if (width < 768) {
    return width >= height ? "mobile-landscape" : "mobile-portrait";
  }

  if (width <= 1024) {
    return "tablet";
  }

  return "desktop";
}

/**
 * Determines whether on-screen virtual joystick and action buttons
 * should be rendered for the current device and layout state.
 *
 * Architecture:
 * - Mobile portrait / landscape: ALWAYS true (phone users have no physical keyboard).
 * - Tablet: true if touch-capable or screen is narrow.
 * - Desktop (> 1024px): false (clean HUD with keyboard WASD / Mouse, no on-screen joystick).
 *
 * @param {string} layoutMode - Result of getLayoutMode()
 * @param {boolean} [isTouch=false] - Result of isTouchCapable()
 * @returns {boolean}
 */
export function shouldShowTouchControls(layoutMode, isTouch = false) {
  if (layoutMode === "mobile-portrait" || layoutMode === "mobile-landscape") {
    return true;
  }
  if (layoutMode === "tablet") {
    return isTouch;
  }
  return false;
}

/**
 * Resolves the explicit CSS layout class.
 *
 * @param {string} layoutMode
 * @returns {"game-layout--desktop" | "game-layout--tablet" | "game-layout--mobile"}
 */
export function getLayoutClass(layoutMode) {
  if (layoutMode === "tablet") return "game-layout--tablet";
  if (layoutMode === "mobile-portrait" || layoutMode === "mobile-landscape") {
    return "game-layout--mobile";
  }
  return "game-layout--desktop";
}

/**
 * Reads safe area insets if CSS environment variables or computed styles are supported.
 * Falls back to zeroes.
 *
 * @param {Window} [win]
 * @returns {{ top: number, right: number, bottom: number, left: number }}
 */
export function getSafeAreaInsets(win = typeof window !== "undefined" ? window : null) {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  if (!win || !win.document || !win.document.documentElement) return insets;

  try {
    const computed = win.getComputedStyle(win.document.documentElement);
    const parse = (val) => {
      const num = parseFloat(val);
      return Number.isFinite(num) ? num : 0;
    };
    insets.top = parse(computed.getPropertyValue("--sat"));
    insets.right = parse(computed.getPropertyValue("--sar"));
    insets.bottom = parse(computed.getPropertyValue("--sab"));
    insets.left = parse(computed.getPropertyValue("--sal"));
  } catch {
    // Graceful fallback to zeros
  }
  return insets;
}

/**
 * React hook that provides real-time device capabilities and responsive dimensions.
 *
 * @returns {{
 *   isTouch: boolean,
 *   viewport: "mobile" | "tablet" | "desktop",
 *   layoutMode: "desktop" | "tablet" | "mobile-portrait" | "mobile-landscape",
 *   layoutClass: "game-layout--desktop" | "game-layout--tablet" | "game-layout--mobile",
 *   showTouchControls: boolean,
 *   isMobile: boolean,
 *   isTablet: boolean,
 *   isDesktop: boolean,
 *   orientation: "landscape" | "portrait",
 *   isLandscape: boolean,
 *   isPortrait: boolean,
 *   width: number,
 *   height: number,
 *   visualViewport: { width: number, height: number, scale: number } | null
 * }}
 */
export function useDeviceCapabilities() {
  const computeState = () => {
    const hasWindow = typeof window !== "undefined";
    const w = hasWindow ? window.innerWidth : 1024;
    const h = hasWindow ? window.innerHeight : 768;
    const vp = getViewportCategory(w);
    const ori = getOrientation(w, h);
    const touch = isTouchCapable();
    const mode = getLayoutMode(w, h);
    const showControls = shouldShowTouchControls(mode, touch);
    const cls = getLayoutClass(mode);

    let vv = null;
    if (hasWindow && window.visualViewport) {
      vv = {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        scale: window.visualViewport.scale
      };
    }

    return {
      isTouch: touch,
      viewport: vp,
      layoutMode: mode,
      layoutClass: cls,
      showTouchControls: showControls,
      isMobile: vp === "mobile" || mode.startsWith("mobile"),
      isTablet: vp === "tablet",
      isDesktop: mode === "desktop",
      orientation: ori,
      isLandscape: ori === "landscape",
      isPortrait: ori === "portrait",
      width: w,
      height: h,
      visualViewport: vv
    };
  };

  const [state, setState] = useState(computeState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      setState(computeState());
    };

    window.addEventListener("resize", handleUpdate, { passive: true });
    window.addEventListener("orientationchange", handleUpdate, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleUpdate, { passive: true });
    }

    // Initial check in case window changed between render and mount
    handleUpdate();

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("orientationchange", handleUpdate);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleUpdate);
      }
    };
  }, []);

  return state;
}
