import test from "node:test";
import assert from "node:assert/strict";
import {
  MISSIONS_CATALOG,
  getLocalizedMission,
  getMissionGoal,
  findMissionById,
  getRandomMission
} from "./missionsData.js";

test("missionsData - catalog defines all 13 facilities with 4 missions each", () => {
  const expectedFacilities = [
    "Shop",
    "Cafe",
    "Hotel",
    "Hospital",
    "Bank",
    "Library",
    "PoliceStation",
    "LanguageSchool",
    "StudyCenter",
    "CommunityCenter",
    "CareerCenter",
    "ActivityCenter",
    "MultiPurposeHall"
  ];

  for (const fac of expectedFacilities) {
    const list = MISSIONS_CATALOG[fac];
    assert.ok(Array.isArray(list), `Facility ${fac} must have a mission array`);
    assert.equal(list.length, 4, `Facility ${fac} must have exactly 4 missions`);
  }
});

test("missionsData - every mission has a unique stable ID", () => {
  const seenIds = new Set();
  let totalCount = 0;

  for (const [facility, list] of Object.entries(MISSIONS_CATALOG)) {
    for (const m of list) {
      assert.ok(m.id, `Mission in ${facility} must have an id`);
      assert.ok(!seenIds.has(m.id), `Duplicate mission id: ${m.id}`);
      seenIds.add(m.id);
      totalCount++;
    }
  }

  assert.equal(totalCount, 52, "Must contain exactly 52 missions across 13 facilities");
});

test("missionsData - all missions have complete bilingual fields", () => {
  for (const [_facility, list] of Object.entries(MISSIONS_CATALOG)) {
    for (const m of list) {
      assert.ok(m.title?.en, `Mission ${m.id} missing en title`);
      assert.ok(m.title?.ko, `Mission ${m.id} missing ko title`);
      assert.ok(m.text?.en, `Mission ${m.id} missing en text`);
      assert.ok(m.text?.ko, `Mission ${m.id} missing ko text`);
      assert.ok(m.goal?.en, `Mission ${m.id} missing en goal`);
      assert.ok(m.goal?.ko, `Mission ${m.id} missing ko goal`);

      // Korean text should contain Korean characters (Hangul)
      assert.match(m.text.ko, /[\uac00-\ud7af]/, `Mission ${m.id} Korean text must contain Hangul`);
    }
  }
});

test("missionsData - Shop missions have valid requiredItems with stable item IDs", () => {
  const shopMissions = MISSIONS_CATALOG.Shop;
  for (const m of shopMissions) {
    assert.ok(m.requiredItems, `Shop mission ${m.id} must define requiredItems`);
    const keys = Object.keys(m.requiredItems);
    assert.ok(keys.length > 0, `Shop mission ${m.id} must require at least 1 item`);
    for (const [itemId, qty] of Object.entries(m.requiredItems)) {
      assert.ok(["water_bottle", "apple", "bread", "milk"].includes(itemId), `Unknown itemId: ${itemId}`);
      assert.ok(typeof qty === "number" && qty > 0, `Quantity must be positive number`);
    }
  }
});

test("getLocalizedMission - returns localized title, text, and goal", () => {
  const mission = MISSIONS_CATALOG.Shop[0];

  const localizedEn = getLocalizedMission(mission, "en");
  assert.equal(localizedEn.id, "shop_001");
  assert.equal(localizedEn.title, "🏪 Shop Mission");
  assert.equal(localizedEn.text, "Buy 2 bottles of water and 1 apple.");

  const localizedKo = getLocalizedMission(mission, "ko");
  assert.equal(localizedKo.id, "shop_001");
  assert.equal(localizedKo.title, "🏪 상점 미션");
  assert.equal(localizedKo.text, "생수 2병과 사과 1개를 구매하세요.");
});

test("getMissionGoal - returns goal according to requested language", () => {
  const mission = MISSIONS_CATALOG.Cafe[0];
  assert.equal(getMissionGoal(mission, "en"), "Order exactly 1 hot Americano and 1 croissant.");
  assert.equal(getMissionGoal(mission, "ko"), "따뜻한 아메리카노 정확히 1잔과 크루아상 1개를 주문하세요.");
});

test("findMissionById - retrieves mission across any facility", () => {
  const mission = findMissionById("library_002");
  assert.ok(mission);
  assert.equal(mission.facility, "Library");
  assert.equal(mission.id, "library_002");

  assert.equal(findMissionById("nonexistent_mission"), null);
});

test("getRandomMission - avoids immediate consecutive repeats", () => {
  const list = MISSIONS_CATALOG.Shop;
  const lastIndexRef = { current: 0 };

  for (let i = 0; i < 20; i++) {
    const prev = lastIndexRef.current;
    getRandomMission(list, lastIndexRef);
    assert.notEqual(lastIndexRef.current, prev, "Random selection should avoid immediate repeat");
  }
});
