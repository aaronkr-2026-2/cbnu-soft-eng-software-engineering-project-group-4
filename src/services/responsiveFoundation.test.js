import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getViewportCategory,
  getOrientation
} from "./deviceDetection.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../");

test("Responsive Foundation - index.html contains required viewport and mobile web app meta tags", () => {
  const indexPath = path.join(ROOT_DIR, "index.html");
  const html = fs.readFileSync(indexPath, "utf-8");

  // Viewport configuration
  assert.ok(html.includes("viewport-fit=cover"), "index.html must specify viewport-fit=cover");
  assert.ok(html.includes("user-scalable=no"), "index.html must prevent double-tap zoom during gameplay");
  assert.ok(html.includes("maximum-scale=1.0"), "index.html must specify maximum-scale=1.0");

  // Mobile Web App standalone tags
  assert.ok(html.includes("apple-mobile-web-app-capable"), "index.html must include apple-mobile-web-app-capable");
  assert.ok(html.includes("apple-mobile-web-app-status-bar-style"), "index.html must specify status-bar-style");
  assert.ok(html.includes("theme-color"), "index.html must include theme-color meta tag");
});

test("Responsive Foundation - index.css defines safe-area variables, touch targets, and selection safeguards", () => {
  const cssPath = path.join(ROOT_DIR, "src/index.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // Safe area variables
  assert.ok(css.includes("--sat: env(safe-area-inset-top"), "CSS must define top safe-area variable");
  assert.ok(css.includes("--sab: env(safe-area-inset-bottom"), "CSS must define bottom safe-area variable");
  assert.ok(css.includes("--sal: env(safe-area-inset-left"), "CSS must define left safe-area variable");
  assert.ok(css.includes("--sar: env(safe-area-inset-right"), "CSS must define right safe-area variable");

  // 100dvh dynamic viewport unit
  assert.ok(css.includes("100dvh"), "CSS must use 100dvh for modern mobile browsers");

  // Touch target minimum (>= 44px)
  assert.ok(css.includes("--min-touch-size: 44px"), "CSS must define minimum 44px touch size");

  // Accidental selection prevention on game viewport
  assert.ok(css.includes("user-select: none"), "CSS must prevent accidental text selection on viewport");

  // Selection preservation on input elements
  assert.ok(css.includes("input,") && css.includes("user-select: text !important"), "CSS must preserve text selection in inputs");

  // Breakpoints
  assert.ok(css.includes("@media (max-width: 768px)"), "CSS must include 768px tablet/mobile breakpoint");
  assert.ok(css.includes("@media (max-width: 480px)"), "CSS must include 480px small mobile breakpoint");
  assert.ok(css.includes("(orientation: landscape)"), "CSS must include landscape mobile breakpoint");
});

test("Responsive Foundation - deviceDetection accurately resolves touch, viewport, and orientation", () => {
  // Mobile Portrait (e.g. iPhone 13/14/15: 390x844)
  assert.equal(getViewportCategory(390), "mobile");
  assert.equal(getOrientation(390, 844), "portrait");

  // Mobile Landscape (e.g. iPhone in landscape: 844x390)
  assert.equal(getViewportCategory(844), "tablet");
  assert.equal(getOrientation(844, 390), "landscape");

  // Compact Android (e.g. Galaxy S8: 360x740)
  assert.equal(getViewportCategory(360), "mobile");
  assert.equal(getOrientation(360, 740), "portrait");

  // Tablet Portrait (iPad: 768x1024)
  assert.equal(getViewportCategory(768), "tablet");
  assert.equal(getOrientation(768, 1024), "portrait");

  // Tablet Landscape (iPad: 1024x768)
  assert.equal(getViewportCategory(1024), "tablet");
  assert.equal(getOrientation(1024, 768), "landscape");

  // Desktop (1920x1080)
  assert.equal(getViewportCategory(1920), "desktop");
  assert.equal(getOrientation(1920, 1080), "landscape");
});

test("Responsive Foundation - CameraController touch listeners do not overwrite desktop mouse handlers", () => {
  const cameraPath = path.join(ROOT_DIR, "src/components/r3f/CameraController.jsx");
  const code = fs.readFileSync(cameraPath, "utf-8");

  // Desktop mouse listeners preserved
  assert.ok(code.includes("addEventListener(\"mousedown\""), "CameraController must preserve mousedown");
  assert.ok(code.includes("addEventListener(\"mousemove\""), "CameraController must preserve mousemove");
  assert.ok(code.includes("addEventListener(\"mouseup\""), "CameraController must preserve mouseup");

  // Mobile touch listeners added
  assert.ok(code.includes("addEventListener(\"touchstart\""), "CameraController must listen to touchstart");
  assert.ok(code.includes("addEventListener(\"touchmove\""), "CameraController must listen to touchmove");
  assert.ok(code.includes("addEventListener(\"touchend\""), "CameraController must listen to touchend");
  assert.ok(code.includes("addEventListener(\"touchcancel\""), "CameraController must listen to touchcancel");

  // Touch isolation (ignores touches on HUD buttons or inputs)
  assert.ok(code.includes("target.tagName === \"BUTTON\""), "Touch handler must ignore touches on buttons");
  assert.ok(code.includes("target.tagName === \"INPUT\""), "Touch handler must ignore touches on inputs");
});

test("Responsive Foundation - Prompts in App.jsx are interactive buttons with touch accessibility", () => {
  const appPath = path.join(ROOT_DIR, "src/App.jsx");
  const code = fs.readFileSync(appPath, "utf-8");

  // Interaction prompts rendered as button elements with interaction-prompt-btn class
  assert.ok(code.includes("className=\"interaction-prompt-btn\""), "Prompts must use interaction-prompt-btn class");
  assert.ok(code.includes("onClick={handleInteractDoor}"), "Door prompt must trigger handleInteractDoor on click/tap");
  assert.ok(code.includes("onClick={handleInteractNPC}"), "NPC prompt must trigger handleInteractNPC on click/tap");
  assert.ok(code.includes("onClick={() => handlePickupItem(itemPrompt)}"), "Pickup prompt must trigger handlePickupItem on click/tap");
});
