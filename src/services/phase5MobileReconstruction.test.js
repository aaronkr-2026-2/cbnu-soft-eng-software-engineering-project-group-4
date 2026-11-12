import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GTA_OUTDOOR_RADIUS,
  GTA_OUTDOOR_BASE_PHI,
  GTA_TARGET_Y,
  GTA_MOBILE_PORTRAIT_RADIUS,
  GTA_MOBILE_PORTRAIT_BASE_PHI,
  GTA_MOBILE_PORTRAIT_TARGET_Y,
  GTA_MOBILE_LANDSCAPE_RADIUS,
  GTA_MOBILE_LANDSCAPE_BASE_PHI,
  GTA_MOBILE_LANDSCAPE_TARGET_Y,
  GTA_TABLET_RADIUS,
  GTA_TABLET_BASE_PHI,
  GTA_TABLET_TARGET_Y,
  getAdaptiveCameraConfig,
  checkCameraBuildingCollision,
  findSafeCameraAngle,
  resolveCameraBuildingPenetration
} from "./cameraCollisionLogic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");

test("Phase 5.0 - Adaptive Camera Configuration resolves correct metrics per layout", () => {
  // 1. Mobile Portrait (e.g. iPhone 14/15 390x844, aspect = 0.462)
  const portraitConfig = getAdaptiveCameraConfig("mobile-portrait", 390 / 844);
  assert.equal(portraitConfig.radius, GTA_MOBILE_PORTRAIT_RADIUS);
  assert.equal(portraitConfig.basePhi, GTA_MOBILE_PORTRAIT_BASE_PHI);
  assert.equal(portraitConfig.targetY, GTA_MOBILE_PORTRAIT_TARGET_Y);
  assert.ok(portraitConfig.fov >= 78 && portraitConfig.fov <= 84, `Portrait FOV should be adaptive ~80-84, got ${portraitConfig.fov}`);

  // Measure visible street span at player position
  const vFOVRad = (portraitConfig.fov * Math.PI) / 180;
  const aspect = 390 / 844;
  const hFOVRad = 2 * Math.atan(Math.tan(vFOVRad / 2) * aspect);
  const visibleHWidth = 2 * portraitConfig.radius * Math.tan(hFOVRad / 2);
  // Previous was 2.30m, now should be >= 4.0m
  assert.ok(visibleHWidth >= 4.0, `Visible horizontal street width should be at least 4.0m, got ${visibleHWidth.toFixed(2)}m`);

  // Player width ratio (0.8m width)
  const playerWidthPct = (0.80 / visibleHWidth) * 100;
  assert.ok(playerWidthPct < 22, `Player should occupy under 22% of screen width (was ~35%), got ${playerWidthPct.toFixed(1)}%`);

  // 2. Mobile Landscape (e.g. 844x390, aspect = 2.164)
  const landscapeConfig = getAdaptiveCameraConfig("mobile-landscape", 844 / 390);
  assert.equal(landscapeConfig.radius, GTA_MOBILE_LANDSCAPE_RADIUS);
  assert.equal(landscapeConfig.basePhi, GTA_MOBILE_LANDSCAPE_BASE_PHI);
  assert.equal(landscapeConfig.targetY, GTA_MOBILE_LANDSCAPE_TARGET_Y);
  assert.equal(landscapeConfig.fov, 65);

  // 3. Tablet (e.g. iPad 768x1024, aspect = 0.75)
  const tabletConfig = getAdaptiveCameraConfig("tablet", 768 / 1024);
  assert.equal(tabletConfig.radius, GTA_TABLET_RADIUS);
  assert.equal(tabletConfig.basePhi, GTA_TABLET_BASE_PHI);
  assert.equal(tabletConfig.targetY, GTA_TABLET_TARGET_Y);
  assert.equal(tabletConfig.fov, 68);

  // 4. Desktop (canonical desktop parameters preserved)
  const desktopConfig = getAdaptiveCameraConfig("desktop", 1920 / 1080);
  assert.equal(desktopConfig.radius, GTA_OUTDOOR_RADIUS);
  assert.equal(desktopConfig.basePhi, GTA_OUTDOOR_BASE_PHI);
  assert.equal(desktopConfig.targetY, GTA_TARGET_Y);
  assert.equal(desktopConfig.fov, 70);
});

test("Phase 5.0 - Collision clearance & penetration failsafes handle extended mobile radius", () => {
  // Test outdoor collision against Shop at x=0, z=-2.5 (curb boundary at z=3.25)
  // Player at x=0, z=3.8 (sidewalk spawn), camera attempting to move north into shop at z=-1.0
  const maxRadius = GTA_MOBILE_PORTRAIT_RADIUS;
  const allowed = checkCameraBuildingCollision(0, 3.8, 0, -1.0, maxRadius);
  assert.ok(allowed < maxRadius, "Camera ray must be blocked before penetrating Shop");
  assert.ok(allowed > 0, "Allowed distance must be positive");

  // Safe angle candidate resolution test
  const safeTheta = findSafeCameraAngle(0, 3.8, Math.PI, GTA_MOBILE_PORTRAIT_BASE_PHI, maxRadius);
  assert.equal(typeof safeTheta, "number", "findSafeCameraAngle must return a valid numerical angle");

  // Penetration push-out failsafe test
  const insideShop = resolveCameraBuildingPenetration(0, -2.5, 0.2);
  assert.ok(
    insideShop.camZ > 3.0 || insideShop.camZ < -8.0 || Math.abs(insideShop.camX) > 3.8,
    "Camera must be pushed outside building bounding box"
  );
});

test("Phase 5.0 - CameraController contains mobile recenter and adaptive optics", () => {
  const camPath = path.join(ROOT_DIR, "src/components/r3f/CameraController.jsx");
  const camContent = fs.readFileSync(camPath, "utf-8");

  assert.ok(camContent.includes("recenterSignalRef"), "CameraController must accept recenterSignalRef prop");
  assert.ok(camContent.includes("isRecenteringRef"), "CameraController must implement smooth recenter animation");
  assert.ok(camContent.includes("getAdaptiveCameraConfig"), "CameraController must call getAdaptiveCameraConfig");
  assert.ok(camContent.includes("adaptiveConfig.fov"), "CameraController must adapt FOV based on viewport layout");
});

test("Phase 5.0 - MobileActionButtons includes Camera Recenter action alongside stats and interaction", () => {
  const mabPath = path.join(ROOT_DIR, "src/components/ui/MobileActionButtons.jsx");
  const mabContent = fs.readFileSync(mabPath, "utf-8");

  assert.ok(mabContent.includes("onRecenterCamera"), "MobileActionButtons must accept onRecenterCamera prop");
  assert.ok(mabContent.includes("mobile-btn-recenter"), "MobileActionButtons must render recenter button");
  assert.ok(mabContent.includes("data-touch-ignore"), "MobileActionButtons must declare data-touch-ignore to prevent camera conflicts");
  assert.ok(mabContent.includes("onTalk"), "Must retain Talk button");
  assert.ok(mabContent.includes("onInteract"), "Must retain Interact button");
});

test("Phase 5.0 - MiniMap includes tactical expanded mode, objective beacon, and rotation", () => {
  const minimapPath = path.join(ROOT_DIR, "src/components/ui/MiniMap.jsx");
  const minimapContent = fs.readFileSync(minimapPath, "utf-8");

  assert.ok(minimapContent.includes("isExpanded"), "MiniMap must manage isExpanded state for enlarged map view");
  assert.ok(minimapContent.includes("activeMission"), "MiniMap must accept activeMission prop");
  assert.ok(minimapContent.includes("objective-pulse"), "MiniMap must render objective waypoint animation");
  assert.ok(minimapContent.includes("pointerRef"), "MiniMap must track heading pointer orientation");
  assert.ok(minimapContent.includes("rotY"), "MiniMap must calculate player rotY heading");
});

test("Phase 5.0 - App.jsx wires recenterSignalRef, mission objective pill, and activeMission to MiniMap", () => {
  const appPath = path.join(ROOT_DIR, "src/App.jsx");
  const appContent = fs.readFileSync(appPath, "utf-8");

  assert.ok(appContent.includes("recenterSignalRef"), "App.jsx must declare recenterSignalRef");
  assert.ok(appContent.includes("handleMobileRecenterCamera"), "App.jsx must declare handleMobileRecenterCamera");
  assert.ok(appContent.includes("mission-objective-pill"), "App.jsx must render mission-objective-pill HUD");
  assert.ok(appContent.includes("activeMission={activeMission}"), "App.jsx must pass activeMission to MiniMap");
});
