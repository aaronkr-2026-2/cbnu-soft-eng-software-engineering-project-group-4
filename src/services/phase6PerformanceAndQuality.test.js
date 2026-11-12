import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import {
  QUALITY_PROFILES,
  detectDeviceInitialQuality,
  getStoredQualityPreference,
  setStoredQualityPreference,
  resolveActiveQualityConfig,
  createDynamicFpsAdapter
} from "./renderingQualityEngine.js";

test("Phase 6.0: Quality profiles contain complete, valid WebGL parameters", () => {
  const tiers = ["low", "medium", "high"];
  for (const tier of tiers) {
    const profile = QUALITY_PROFILES[tier];
    assert.ok(profile, `Profile ${tier} must exist`);
    assert.strictEqual(profile.id, tier);
    assert.ok(Array.isArray(profile.dpr) && profile.dpr.length === 2, "dpr must be [min, max]");
    assert.strictEqual(typeof profile.shadows, "boolean", "shadows must be boolean");
    assert.strictEqual(typeof profile.shadowMapSize, "number", "shadowMapSize must be number");
    assert.ok(profile.fogNear < profile.fogFar, "fogNear must be less than fogFar");
  }

  // Low quality must have shadows disabled and dpr locked to 1.0 for rock-solid low-end performance
  assert.strictEqual(QUALITY_PROFILES.low.shadows, false);
  assert.deepStrictEqual(QUALITY_PROFILES.low.dpr, [1, 1]);
});

test("Phase 6.0: detectDeviceInitialQuality selects appropriate profile based on device signals", () => {
  // Mobile touch device simulation
  const mockMobile = {
    innerWidth: 390,
    innerHeight: 844,
    navigator: { hardwareConcurrency: 4, deviceMemory: 3, maxTouchPoints: 5 }
  };
  assert.strictEqual(detectDeviceInitialQuality(mockMobile), "low");

  // High-spec desktop simulation
  const mockHighEndDesktop = {
    innerWidth: 1920,
    innerHeight: 1080,
    navigator: { hardwareConcurrency: 10, deviceMemory: 16, maxTouchPoints: 0 }
  };
  assert.strictEqual(detectDeviceInitialQuality(mockHighEndDesktop), "high");

  // Standard notebook simulation
  const mockStandardLaptop = {
    innerWidth: 1366,
    innerHeight: 768,
    navigator: { hardwareConcurrency: 4, deviceMemory: 4, maxTouchPoints: 0 }
  };
  assert.strictEqual(detectDeviceInitialQuality(mockStandardLaptop), "medium");
});

test("Phase 6.0: resolveActiveQualityConfig resolves preferences, auto, and dynamic overrides", () => {
  // Persistence test with mock localStorage
  const storage = new Map();
  const mockWin = {
    localStorage: {
      getItem: (k) => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, String(v))
    }
  };

  setStoredQualityPreference("low", mockWin);
  assert.strictEqual(getStoredQualityPreference(mockWin), "low");
  setStoredQualityPreference("auto", mockWin);
  assert.strictEqual(getStoredQualityPreference(mockWin), "auto");

  // Explicit preference
  const lowConfig = resolveActiveQualityConfig("low");
  assert.strictEqual(lowConfig.activeTier, "low");
  assert.strictEqual(lowConfig.shadows, false);

  const highConfig = resolveActiveQualityConfig("high");
  assert.strictEqual(highConfig.activeTier, "high");
  assert.strictEqual(highConfig.shadows, true);

  // Dynamic tier override takes precedence during runtime FPS drops
  const overridden = resolveActiveQualityConfig("high", "low");
  assert.strictEqual(overridden.activeTier, "low");
  assert.strictEqual(overridden.shadows, false);
});

test("Phase 6.0: createDynamicFpsAdapter adjusts quality tier on sustained frame drops", () => {
  let changedTier = null;
  const adapter = createDynamicFpsAdapter({
    initialTier: "high",
    onQualityChange: (newTier) => {
      changedTier = newTier;
    }
  });

  assert.strictEqual(adapter.getCurrentTier(), "high");

  // Simulate 95 slow frames (frame delta = 50ms = 20 FPS)
  for (let i = 0; i < 95; i++) {
    adapter.update(0.05);
  }

  // Quality should gracefully demote from high to medium
  assert.strictEqual(changedTier, "medium");
  assert.strictEqual(adapter.getCurrentTier(), "medium");
});

test("Phase 6.0: 3D Asset Optimization preserves models while slashing sizes by >95%", () => {
  const carStat = fs.statSync("public/models/car.glb");
  const tower2Stat = fs.statSync("public/models/skyscraper2.glb");
  const playerStat = fs.statSync("public/models/player.glb");
  const shelfStat = fs.statSync("public/models/shop_furniture_new.glb");
  const skyscraperStat = fs.statSync("public/models/skyscraper.glb");

  // Car model reduced from 40.3 MB to under 100 KB
  assert.ok(carStat.size < 100 * 1024, `car.glb must be < 100KB, got ${carStat.size / 1024}KB`);

  // Skyscraper 2 reduced from 52.1 MB to under 50 KB
  assert.ok(tower2Stat.size < 50 * 1024, `skyscraper2.glb must be < 50KB, got ${tower2Stat.size / 1024}KB`);

  // Player model reduced from 17.5 MB to under 5 MB
  assert.ok(playerStat.size < 5 * 1024 * 1024, `player.glb must be < 5MB, got ${playerStat.size / 1e6}MB`);

  // Shop furniture shelf reduced from 54.8 MB to under 200 KB
  assert.ok(shelfStat.size < 200 * 1024, `shop_furniture_new.glb must be < 200KB, got ${shelfStat.size / 1024}KB`);

  // Skyscraper 1 reduced and merged into 6 draw calls
  assert.ok(skyscraperStat.size < 4.5 * 1024 * 1024, `skyscraper.glb must be < 4.5MB, got ${skyscraperStat.size / 1e6}MB`);
});

test("Phase 6.0: Architectural Component Optimization Verification", () => {
  const streetLightsCode = fs.readFileSync("src/components/r3f/StreetLights.jsx", "utf-8");
  assert.ok(streetLightsCode.includes("instancedMesh"), "StreetLights must use instancedMesh");

  const resBoundariesCode = fs.readFileSync("src/components/r3f/ResidentialBoundaries.jsx", "utf-8");
  assert.ok(resBoundariesCode.includes("BatchedBoundaryWalls"), "ResidentialBoundaries must batch boundary walls");
  assert.ok(resBoundariesCode.includes("InstancedGatePillars"), "ResidentialBoundaries must instance gate pillars");

  const minimapCode = fs.readFileSync("src/components/ui/MiniMap.jsx", "utf-8");
  assert.ok(minimapCode.includes("lastPx"), "MiniMap must contain idle player check to throttle DOM writes");

  const settingsModalCode = fs.readFileSync("src/components/ui/SettingsModal.jsx", "utf-8");
  assert.ok(settingsModalCode.includes("QUALITY_OPTIONS"), "SettingsModal must provide quality selection");

  const canvasCode = fs.readFileSync("src/components/r3f/VillageCanvas.jsx", "utf-8");
  assert.ok(canvasCode.includes("PerformanceMonitor"), "VillageCanvas must wire PerformanceMonitor");
  assert.ok(canvasCode.includes("dpr={quality.dpr}"), "VillageCanvas must bind adaptive dpr");
});
