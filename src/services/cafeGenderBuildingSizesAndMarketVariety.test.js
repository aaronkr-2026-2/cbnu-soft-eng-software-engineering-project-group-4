import test from "node:test";
import assert from "node:assert/strict";

import {
  NPC_PROFILES,
  getNPCGender,
  getNPCInitialGreeting
} from "./npcPromptLogic.js";
import { getBestVoiceForNPC } from "./voiceFeedbackLogic.js";
import {
  VILLAGE_BUILDINGS,
  VILLAGE_SIGN_CONFIG
} from "../components/r3f/villageBuildingsConfig.js";
import {
  MISSIONS_CATALOG,
  selectNextMission,
  getRandomMission
} from "./missionsData.js";
import {
  DEFAULT_SHOP_3D_ITEMS,
  ITEM_DEFINITIONS,
  formatInventorySummary,
  validateMissionInventory
} from "./inventoryLogic.js";

// =============================================================================
// TASK 1: CAFE NPC MALE CONFIGURATION & VOICE MAPPING
// =============================================================================

test("Task 1 - Cafe NPC Profile is configured as male", () => {
  const cafeProfile = NPC_PROFILES["Cafe Barista"];
  assert.ok(cafeProfile, "Cafe Barista profile should exist in NPC_PROFILES");
  assert.equal(cafeProfile.characterGender, "male");
  assert.equal(cafeProfile.voiceGender, "male");
  assert.equal(cafeProfile.name, "Mia");
});

test("Task 1 - Cafe NPC name aliases all resolve to male gender", () => {
  const aliases = [
    "Cafe Barista",
    "Barista Mia",
    "Cafe",
    "Barista",
    "Cafe NPC",
    "Mia",
    "바리스타 미아",
    "미아"
  ];

  for (const alias of aliases) {
    const gender = getNPCGender(alias);
    assert.equal(gender, "male", `Alias '${alias}' should resolve to male gender`);
  }
});

test("Task 1 - Male NPCs retain male gender (no regression)", () => {
  const maleNPCs = ["Shop Seller", "Jack", "Bank Employee", "David", "Police Officer Alex", "Alex"];
  for (const name of maleNPCs) {
    const gender = getNPCGender(name);
    assert.equal(gender, "male", `NPC '${name}' should resolve to male`);
  }
});

test("Task 1 - Cafe NPC selects English male voice in English learning mode", () => {
  const mockEnglishVoices = [
    { name: "Microsoft David - English (United States)", lang: "en-US" },
    { name: "Daniel", lang: "en-GB" },
    { name: "Samantha", lang: "en-US" },
    { name: "Microsoft Zira - English (United States)", lang: "en-US" },
    { name: "Victoria", lang: "en-US" }
  ];

  const cafeVoice = getBestVoiceForNPC(mockEnglishVoices, "Cafe Barista", "en");
  assert.ok(cafeVoice, "Voice should be selected for Cafe Barista");
  assert.ok(
    ["david", "daniel", "guy"].some((m) => cafeVoice.name.toLowerCase().includes(m)),
    `Selected voice '${cafeVoice.name}' should be an English male voice`
  );
  assert.notEqual(cafeVoice.name, "Samantha");
  assert.notEqual(cafeVoice.name, "Victoria");
  assert.notEqual(cafeVoice.name, "Microsoft Zira - English (United States)");
});

test("Task 1 - Cafe NPC selects Korean male voice in Korean learning mode across platforms", () => {
  // macOS Korean voice pool
  const macOSVoices = [
    { name: "Eddy (Korean)", lang: "ko-KR" },
    { name: "Yuna", lang: "ko-KR" }
  ];
  const macCafeVoice = getBestVoiceForNPC(macOSVoices, "Cafe Barista", "ko");
  assert.ok(macCafeVoice, "Should select voice on macOS");
  assert.equal(macCafeVoice.name, "Eddy (Korean)", "Cafe NPC on macOS should select Eddy");

  // Windows Korean voice pool
  const winVoices = [
    { name: "Microsoft Injoon - Korean (Korean)", lang: "ko-KR" },
    { name: "Microsoft SunHi - Korean (Korean)", lang: "ko-KR" }
  ];
  const winCafeVoice = getBestVoiceForNPC(winVoices, "Cafe Barista", "ko");
  assert.ok(winCafeVoice, "Should select voice on Windows");
  assert.equal(winCafeVoice.name, "Microsoft Injoon - Korean (Korean)", "Cafe NPC on Windows should select Injoon");
});

test("Task 1 - Cafe NPC produces natural Korean and English initial greetings", () => {
  const koGreeting = getNPCInitialGreeting("Cafe Barista", "ko");
  assert.ok(koGreeting.includes("카페"), "Korean greeting should mention cafe");
  assert.ok(koGreeting.includes("음료"), "Korean greeting should offer drink/beverage");
  assert.ok(!koGreeting.includes("Hello"), "Korean greeting should not contain English words");

  const enGreeting = getNPCInitialGreeting("Cafe Barista", "en");
  assert.ok(enGreeting.toLowerCase().includes("cafe"), "English greeting should welcome to cafe");
  assert.ok(enGreeting.toLowerCase().includes("brew"), "English greeting should mention brewing");
  assert.ok(!/[가-힣]/.test(enGreeting), "English greeting should not contain Korean characters");
});

// =============================================================================
// TASK 2: SIX STANDARDIZED BUILDINGS RECONSTRUCTED SPATIAL LAYOUT
// =============================================================================

test("Task 2 - Six district buildings maintain canonical scale [7.0, 7.0, 7.0]", () => {
  const sixBuildingIds = [
    "career-center",
    "multi-purpose-hall",
    "community-center",
    "study-center",
    "language-school",
    "activity-center"
  ];

  const standardScale = [7.0, 7.0, 7.0];

  for (const bId of sixBuildingIds) {
    const building = VILLAGE_BUILDINGS.find((b) => b.id === bId);
    assert.ok(building, `Building '${bId}' must exist in VILLAGE_BUILDINGS`);
    assert.deepEqual(
      building.scale,
      standardScale,
      `Building '${bId}' scale should match canonical standard scale [7.0, 7.0, 7.0]`
    );
  }
});

test("Task 2 - Standard reference buildings in VILLAGE_BUILDINGS also have canonical scale [7.0, 7.0, 7.0]", () => {
  const standardIds = ["building-type-a", "building-type-b", "building-type-c", "building-type-e"];
  for (const sId of standardIds) {
    const building = VILLAGE_BUILDINGS.find((b) => b.id === sId);
    assert.ok(building, `Reference building '${sId}' must exist`);
    assert.deepEqual(building.scale, [7.0, 7.0, 7.0], `Reference building '${sId}' should have scale [7.0, 7.0, 7.0]`);
  }
});

test("Task 2 - Six district buildings have collision boundaries scaled appropriately", () => {
  const sixBuildingIds = [
    "career-center",
    "multi-purpose-hall",
    "community-center",
    "study-center",
    "language-school",
    "activity-center"
  ];

  for (const bId of sixBuildingIds) {
    const building = VILLAGE_BUILDINGS.find((b) => b.id === bId);
    assert.ok(building.collision, `Building '${bId}' should have collision defined`);
    const { halfW, halfD } = building.collision;
    assert.ok(halfW >= 3.0 && halfW <= 5.0, `halfW (${halfW}) for '${bId}' should match 7.0x footprint`);
    assert.ok(halfD >= 3.0 && halfD <= 4.0, `halfD (${halfD}) for '${bId}' should match 7.0x footprint`);
  }
});

test("Task 2 - Village signage for six district buildings has canonical elevation and dimensions", () => {
  const sixSignIds = [
    "career-center",
    "multi-purpose-hall",
    "community-center",
    "study-center",
    "language-school",
    "activity-center"
  ];

  for (const sId of sixSignIds) {
    const signConfig = VILLAGE_SIGN_CONFIG[sId];
    assert.ok(signConfig, `Sign config for '${sId}' should exist`);
    assert.equal(signConfig.position[1], 3.9, `Sign '${sId}' elevation Y should be 3.9`);
    assert.equal(signConfig.width, 4.0, `Sign '${sId}' width should be 4.0`);
    assert.equal(signConfig.height, 0.95, `Sign '${sId}' height should be 0.95`);
  }
});

test("Task 2 - No two district buildings overlap (pairwise AABB separation)", () => {
  const sixBuildingIds = [
    "career-center",
    "multi-purpose-hall",
    "community-center",
    "study-center",
    "language-school",
    "activity-center"
  ];

  const districtBuildings = sixBuildingIds.map((id) =>
    VILLAGE_BUILDINGS.find((b) => b.id === id)
  );

  for (let i = 0; i < districtBuildings.length; i++) {
    for (let j = i + 1; j < districtBuildings.length; j++) {
      const b1 = districtBuildings[i];
      const b2 = districtBuildings[j];

      const minX1 = b1.position[0] - b1.collision.halfW;
      const maxX1 = b1.position[0] + b1.collision.halfW;
      const minZ1 = b1.position[2] - b1.collision.halfD;
      const maxZ1 = b1.position[2] + b1.collision.halfD;

      const minX2 = b2.position[0] - b2.collision.halfW;
      const maxX2 = b2.position[0] + b2.collision.halfW;
      const minZ2 = b2.position[2] - b2.collision.halfD;
      const maxZ2 = b2.position[2] + b2.collision.halfD;

      const xOverlap = Math.min(maxX1, maxX2) - Math.max(minX1, minX2);
      const zOverlap = Math.min(maxZ1, maxZ2) - Math.max(minZ1, minZ2);

      const isOverlapping = xOverlap > 0 && zOverlap > 0;
      assert.equal(
        isOverlapping,
        false,
        `Buildings '${b1.name}' and '${b2.name}' must not overlap (xOverlap=${xOverlap.toFixed(2)}, zOverlap=${zOverlap.toFixed(2)})`
      );
    }
  }
});

test("Task 2 - Minimum pedestrian corridor clearance (>= 2.5m) between all neighboring buildings", () => {
  const lang = VILLAGE_BUILDINGS.find((b) => b.id === "language-school");
  const study = VILLAGE_BUILDINGS.find((b) => b.id === "study-center");
  const comm = VILLAGE_BUILDINGS.find((b) => b.id === "community-center");
  const career = VILLAGE_BUILDINGS.find((b) => b.id === "career-center");
  const act = VILLAGE_BUILDINGS.find((b) => b.id === "activity-center");
  const hall = VILLAGE_BUILDINGS.find((b) => b.id === "multi-purpose-hall");

  // West side corridor: Language School to Study Center
  const westCorridor = (study.position[0] - study.collision.halfW) - (lang.position[0] + lang.collision.halfW);
  assert.ok(
    westCorridor >= 2.5,
    `West corridor between Language School and Study Center must be >= 2.5m (actual: ${westCorridor.toFixed(2)}m)`
  );

  // East side corridor: Community Center to Career Center
  const eastCorridor = (career.position[0] - career.collision.halfW) - (comm.position[0] + comm.collision.halfW);
  assert.ok(
    eastCorridor >= 2.5,
    `East corridor between Community Center and Career Center must be >= 2.5m (actual: ${eastCorridor.toFixed(2)}m)`
  );

  // Center Plaza Promenade: Study Center to Community Center
  const centerPlaza = (comm.position[0] - comm.collision.halfW) - (study.position[0] + study.collision.halfW);
  assert.ok(
    centerPlaza >= 5.0,
    `Central plaza between Study Center and Community Center must be wide public promenade (actual: ${centerPlaza.toFixed(2)}m)`
  );

  // North-South clearance: Front buildings (Z=38) to Rear buildings (Z=48.5)
  const actClearance = (act.position[2] - act.collision.halfD) - (study.position[2] + study.collision.halfD);
  assert.ok(
    actClearance >= 2.5,
    `Clearance from front row to Activity Center must be >= 2.5m (actual: ${actClearance.toFixed(2)}m)`
  );

  const hallClearance = (hall.position[2] - hall.collision.halfD) - (comm.position[2] + comm.collision.halfD);
  assert.ok(
    hallClearance >= 2.5,
    `Clearance from front row to Multi-Purpose Hall must be >= 2.5m (actual: ${hallClearance.toFixed(2)}m)`
  );
});

test("Task 2 - Central road clearance is preserved with no building encroachment", () => {
  // North Residential Street centerline is at Z = 28.0 with half-width 3.0m (road curb at Z = 31.0, sidewalk to Z = 32.5)
  const ROAD_NORTH_EDGE = 31.0;
  const SIDEWALK_NORTH_EDGE = 32.5;

  const sixBuildingIds = [
    "career-center",
    "multi-purpose-hall",
    "community-center",
    "study-center",
    "language-school",
    "activity-center"
  ];

  for (const bId of sixBuildingIds) {
    const building = VILLAGE_BUILDINGS.find((b) => b.id === bId);
    const southAABBEdge = building.position[2] - building.collision.halfD;

    assert.ok(
      southAABBEdge > ROAD_NORTH_EDGE + 3.0,
      `Building '${building.name}' south edge (${southAABBEdge}) must maintain > 3.0m clearance from road edge (${ROAD_NORTH_EDGE})`
    );

    assert.ok(
      southAABBEdge > SIDEWALK_NORTH_EDGE + 1.5,
      `Building '${building.name}' south edge (${southAABBEdge}) must not encroach on sidewalk (${SIDEWALK_NORTH_EDGE})`
    );
  }
});

// =============================================================================
// TASK 3: MARKET MISSION VARIETY & ANTI-REPEAT SYSTEM
// =============================================================================

test("Task 3 - Market mission catalog contains multiple distinct shopping missions", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  assert.ok(Array.isArray(shopMissions) && shopMissions.length >= 4, "Shop catalog should have at least 4 missions");

  const uniqueIds = new Set(shopMissions.map((m) => m.id));
  assert.equal(uniqueIds.size, shopMissions.length, "All shop mission IDs must be unique");

  for (const m of shopMissions) {
    assert.ok(m.requiredItems && Object.keys(m.requiredItems).length > 0, `Mission ${m.id} must require items`);
    assert.ok(m.title && m.title.en && m.title.ko, `Mission ${m.id} must have bilingual titles`);
    assert.ok(m.goal && m.goal.en && m.goal.ko, `Mission ${m.id} must have bilingual goals`);
  }
});

test("Task 3 - selectNextMission avoids immediate repeats and rotates cleanly through all missions", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  const lastIndexRef = { current: -1 };
  const recentMissionIds = [];

  const seenIds = [];
  for (let i = 0; i < 4; i++) {
    const nextMission = selectNextMission(shopMissions, {
      lastIndexRef,
      recentMissionIds,
      completedMissionIds: []
    });
    assert.ok(nextMission, `Selection step ${i} should return a valid mission`);
    assert.ok(!recentMissionIds.includes(nextMission.id), `Selected mission ${nextMission.id} should not be in recent history`);
    recentMissionIds.push(nextMission.id);
    seenIds.push(nextMission.id);
  }

  // All 4 distinct missions should have been selected without duplicates
  const uniqueSeen = new Set(seenIds);
  assert.equal(uniqueSeen.size, 4, "Should select 4 distinct missions over 4 steps");
});

test("Task 3 - selectNextMission prioritizes uncompleted missions over completed ones", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  const lastIndexRef = { current: -1 };

  // Assume user already completed shop_001 and shop_002
  const completedMissionIds = ["shop_001", "shop_002"];
  const recentMissionIds = [];

  const selected = selectNextMission(shopMissions, {
    lastIndexRef,
    recentMissionIds,
    completedMissionIds
  });

  assert.ok(
    selected.id === "shop_003" || selected.id === "shop_004",
    `Should prioritize uncompleted missions (expected shop_003 or shop_004, got ${selected.id})`
  );
});

test("Task 3 - selectNextMission rotates cleanly when all missions have been completed", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  const lastIndexRef = { current: -1 };
  const completedMissionIds = ["shop_001", "shop_002", "shop_003", "shop_004"];
  const recentMissionIds = ["shop_001", "shop_002", "shop_003"];

  const next = selectNextMission(shopMissions, {
    lastIndexRef,
    recentMissionIds,
    completedMissionIds
  });

  // Since shop_001, shop_002, shop_003 are in recent, shop_004 is the only un-played candidate
  assert.equal(next.id, "shop_004", "Should select the non-recent mission even when all are completed");
});

test("Task 3 - getRandomMission maintains backward compatibility with selectNextMission", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  const lastIndexRef = { current: 0 }; // Just saw shop_001
  const next = getRandomMission(shopMissions, lastIndexRef);

  assert.ok(next, "getRandomMission should return a mission");
  assert.notEqual(next.id, shopMissions[0].id, "getRandomMission should avoid immediate repeat");
});

test("Task 3 - DEFAULT_SHOP_3D_ITEMS contains all items needed for all shop missions", () => {
  // Aggregate all items required across all 4 shop missions
  const totalRequired = {};
  for (const m of MISSIONS_CATALOG.Shop) {
    for (const [itemId, qty] of Object.entries(m.requiredItems || {})) {
      totalRequired[itemId] = Math.max(totalRequired[itemId] || 0, qty);
    }
  }

  // Count available 3D items in DEFAULT_SHOP_3D_ITEMS
  const availableCounts = {};
  for (const item of DEFAULT_SHOP_3D_ITEMS) {
    availableCounts[item.itemId] = (availableCounts[item.itemId] || 0) + 1;
    assert.ok(ITEM_DEFINITIONS[item.itemId], `Item '${item.itemId}' must exist in ITEM_DEFINITIONS`);
  }

  // Ensure milk is available
  assert.ok(availableCounts.milk && availableCounts.milk >= 2, "Shop must have at least 2 milk bottles");

  for (const [itemId, requiredQty] of Object.entries(totalRequired)) {
    const available = availableCounts[itemId] || 0;
    assert.ok(
      available >= requiredQty,
      `Shop 3D inventory must have at least ${requiredQty} of '${itemId}' to fulfill missions, found ${available}`
    );
  }
});

test("Task 3 - formatInventorySummary accurately translates item requirements", () => {
  const reqMap = { water_bottle: 2, apple: 1, milk: 2 };

  const koSummary = formatInventorySummary(reqMap, "ko");
  assert.ok(koSummary.includes("생수"), "Korean summary should include 생수");
  assert.ok(koSummary.includes("사과"), "Korean summary should include 사과");
  assert.ok(koSummary.includes("우유"), "Korean summary should include 우유");

  const enSummary = formatInventorySummary(reqMap, "en");
  assert.ok(enSummary.toLowerCase().includes("water"), "English summary should include water");
  assert.ok(enSummary.toLowerCase().includes("apple"), "English summary should include apple");
  assert.ok(enSummary.toLowerCase().includes("milk"), "English summary should include milk");
});

test("Task 3 - validateMissionInventory correctly validates all shop missions with full stock", () => {
  for (const mission of MISSIONS_CATALOG.Shop) {
    // Inventory with full items collected
    const collectedInv = { ...mission.requiredItems };
    const val = validateMissionInventory(mission, collectedInv, "en");
    assert.equal(val.isComplete, true, `Mission ${mission.id} should validate as complete with collected inventory`);
    assert.equal(val.missingList.length, 0, `Mission ${mission.id} should have 0 missing items`);

    // Inventory with 0 items
    const emptyVal = validateMissionInventory(mission, {}, "en");
    assert.equal(emptyVal.isComplete, false, `Mission ${mission.id} should not be complete with empty inventory`);
    assert.ok(emptyVal.missingList.length > 0, `Mission ${mission.id} should report missing items`);
  }
});
