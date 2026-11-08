import test from "node:test";
import assert from "node:assert/strict";
import {
  isTouchCapable,
  getViewportCategory,
  getOrientation,
  getSafeAreaInsets,
  getLayoutMode,
  shouldShowTouchControls,
  getLayoutClass
} from "./deviceDetection.js";

test("deviceDetection - isTouchCapable handles various environments", () => {
  // Null or undefined window
  assert.equal(isTouchCapable(null), false);
  assert.equal(isTouchCapable(undefined), false);

  // Desktop without touch
  const mockDesktop = {
    navigator: { maxTouchPoints: 0 }
  };
  assert.equal(isTouchCapable(mockDesktop), false);

  // Touchscreen laptop or mobile device with maxTouchPoints > 0
  const mockTouchDevice = {
    navigator: { maxTouchPoints: 5 }
  };
  assert.equal(isTouchCapable(mockTouchDevice), true);

  // Legacy IE/Edge msMaxTouchPoints
  const mockLegacyTouch = {
    navigator: { maxTouchPoints: 0, msMaxTouchPoints: 2 }
  };
  assert.equal(isTouchCapable(mockLegacyTouch), true);

  // Device with ontouchstart property
  const mockOntouchstart = {
    ontouchstart: null,
    navigator: { maxTouchPoints: 0 }
  };
  assert.equal(isTouchCapable(mockOntouchstart), true);
});

test("deviceDetection - getViewportCategory classifies widths accurately", () => {
  // Mobile: < 768px
  assert.equal(getViewportCategory(320), "mobile");
  assert.equal(getViewportCategory(375), "mobile");
  assert.equal(getViewportCategory(414), "mobile");
  assert.equal(getViewportCategory(767), "mobile");
  assert.equal(getViewportCategory(undefined), "mobile");
  assert.equal(getViewportCategory("invalid"), "mobile");

  // Tablet: 768px - 1024px
  assert.equal(getViewportCategory(768), "tablet");
  assert.equal(getViewportCategory(820), "tablet");
  assert.equal(getViewportCategory(1024), "tablet");

  // Desktop: > 1024px
  assert.equal(getViewportCategory(1025), "desktop");
  assert.equal(getViewportCategory(1280), "desktop");
  assert.equal(getViewportCategory(1920), "desktop");
});

test("deviceDetection - getOrientation determines orientation correctly", () => {
  // Portrait
  assert.equal(getOrientation(375, 812), "portrait");
  assert.equal(getOrientation(768, 1024), "portrait");

  // Landscape
  assert.equal(getOrientation(812, 375), "landscape");
  assert.equal(getOrientation(1024, 768), "landscape");
  assert.equal(getOrientation(1920, 1080), "landscape");

  // Equal width and height defaults to landscape
  assert.equal(getOrientation(500, 500), "landscape");

  // Invalid arguments default safely to landscape
  assert.equal(getOrientation(null, null), "landscape");
});

test("deviceDetection - getLayoutMode resolves responsive categories accurately", () => {
  // Mobile portrait (390 x 844 iPhone)
  assert.equal(getLayoutMode(390, 844), "mobile-portrait");
  // Mobile landscape (844 x 390 iPhone sideways)
  assert.equal(getLayoutMode(844, 390), "mobile-landscape");
  // Tablet portrait (768 x 1024 iPad)
  assert.equal(getLayoutMode(768, 1024), "tablet");
  // Tablet landscape (1024 x 768 iPad)
  assert.equal(getLayoutMode(1024, 768), "tablet");
  // Desktop standard (1440 x 900)
  assert.equal(getLayoutMode(1440, 900), "desktop");
  // Desktop wide (1920 x 1080)
  assert.equal(getLayoutMode(1920, 1080), "desktop");
});

test("deviceDetection - shouldShowTouchControls enforces mutually exclusive control sets", () => {
  // Mobile always shows touch controls
  assert.equal(shouldShowTouchControls("mobile-portrait", false), true);
  assert.equal(shouldShowTouchControls("mobile-portrait", true), true);
  assert.equal(shouldShowTouchControls("mobile-landscape", false), true);
  assert.equal(shouldShowTouchControls("mobile-landscape", true), true);

  // Tablet shows touch controls when touch is capable
  assert.equal(shouldShowTouchControls("tablet", true), true);
  assert.equal(shouldShowTouchControls("tablet", false), false);

  // Desktop never shows virtual joystick (uses WASD/mouse)
  assert.equal(shouldShowTouchControls("desktop", false), false);
  assert.equal(shouldShowTouchControls("desktop", true), false);
});

test("deviceDetection - getLayoutClass returns proper semantic class names", () => {
  assert.equal(getLayoutClass("desktop"), "game-layout--desktop");
  assert.equal(getLayoutClass("tablet"), "game-layout--tablet");
  assert.equal(getLayoutClass("mobile-portrait"), "game-layout--mobile");
  assert.equal(getLayoutClass("mobile-landscape"), "game-layout--mobile");
});
test("deviceDetection - getSafeAreaInsets reads CSS variables or falls back to zeroes", () => {
  // Null window
  assert.deepEqual(getSafeAreaInsets(null), { top: 0, right: 0, bottom: 0, left: 0 });

  // Mock window with computed styles
  const mockWin = {
    document: {
      documentElement: {}
    },
    getComputedStyle: () => ({
      getPropertyValue: (prop) => {
        if (prop === "--sat") return "44px";
        if (prop === "--sab") return "34px";
        if (prop === "--sal") return "0px";
        if (prop === "--sar") return "0px";
        return "";
      }
    })
  };

  assert.deepEqual(getSafeAreaInsets(mockWin), {
    top: 44,
    right: 0,
    bottom: 34,
    left: 0
  });
});
