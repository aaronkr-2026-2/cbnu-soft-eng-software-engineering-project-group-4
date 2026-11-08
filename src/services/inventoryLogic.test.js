import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ITEM_DEFINITIONS,
  DEFAULT_SHOP_3D_ITEMS,
  addItemToInventory,
  getItemCount,
  isItemAlreadyCollected,
  formatInventorySummary,
  parseMissionRequiredItems,
  validateMissionInventory
} from "./inventoryLogic.js";

describe("inventoryLogic - Item Definitions and 3D Placements", () => {
  it("defines standard grocery items with valid properties", () => {
    assert.ok(ITEM_DEFINITIONS.water_bottle);
    assert.equal(ITEM_DEFINITIONS.water_bottle.displayName, "Water Bottle");
    assert.equal(ITEM_DEFINITIONS.water_bottle.category, "beverage");

    assert.ok(ITEM_DEFINITIONS.apple);
    assert.equal(ITEM_DEFINITIONS.apple.displayName, "Red Apple");

    assert.ok(ITEM_DEFINITIONS.bread);
    assert.equal(ITEM_DEFINITIONS.bread.displayName, "Loaf of Bread");
  });

  it("contains 3D Shop physical item placements within reachable shop coordinates", () => {
    assert.ok(DEFAULT_SHOP_3D_ITEMS.length >= 5);
    for (const item of DEFAULT_SHOP_3D_ITEMS) {
      assert.ok(item.instanceId);
      assert.ok(ITEM_DEFINITIONS[item.itemId]);
      assert.equal(item.position.length, 3);
      // Shop player bounds are x in [-2.8, 2.8], z in [-2.2, 2.4]
      assert.ok(item.position[0] >= -2.8 && item.position[0] <= 2.8);
      assert.ok(item.position[2] >= -2.2 && item.position[2] <= 2.4);
    }
  });
});

describe("inventoryLogic - Inventory Manipulation", () => {
  it("adds items to empty inventory immutably", () => {
    const initial = {};
    const updated = addItemToInventory(initial, "water_bottle", 1);

    assert.equal(initial.water_bottle, undefined);
    assert.equal(updated.water_bottle, 1);
  });

  it("increments quantity for existing items", () => {
    let inv = { water_bottle: 1 };
    inv = addItemToInventory(inv, "water_bottle", 1);
    assert.equal(inv.water_bottle, 2);

    inv = addItemToInventory(inv, "apple", 1);
    assert.equal(inv.water_bottle, 2);
    assert.equal(inv.apple, 1);
  });

  it("ignores invalid or zero quantity updates", () => {
    const inv = { water_bottle: 2 };
    assert.deepEqual(addItemToInventory(inv, "water_bottle", 0), inv);
    assert.deepEqual(addItemToInventory(inv, "", 1), inv);
    assert.deepEqual(addItemToInventory(inv, null, 1), inv);
  });

  it("retrieves item count safely", () => {
    const inv = { water_bottle: 2, apple: 1 };
    assert.equal(getItemCount(inv, "water_bottle"), 2);
    assert.equal(getItemCount(inv, "apple"), 1);
    assert.equal(getItemCount(inv, "bread"), 0);
    assert.equal(getItemCount(null, "water_bottle"), 0);
  });

  it("formats readable inventory summary string", () => {
    assert.equal(formatInventorySummary({}), "Empty");
    assert.equal(
      formatInventorySummary({ water_bottle: 2, apple: 1 }),
      "2 Water Bottles, 1 Red Apple"
    );
  });
});

describe("inventoryLogic - Pickup Idempotency", () => {
  it("detects already collected items with Set and Array", () => {
    const collectedArray = ["shop_water_1", "shop_apple_1"];
    assert.equal(isItemAlreadyCollected(collectedArray, "shop_water_1"), true);
    assert.equal(isItemAlreadyCollected(collectedArray, "shop_water_2"), false);

    const collectedSet = new Set(["shop_water_1"]);
    assert.equal(isItemAlreadyCollected(collectedSet, "shop_water_1"), true);
    assert.equal(isItemAlreadyCollected(collectedSet, "shop_bread_1"), false);
  });
});

describe("inventoryLogic - Mission Parsing and Validation", () => {
  it("parses mission required items correctly from text", () => {
    const req1 = parseMissionRequiredItems("Buy exactly 2 bottles of water and 1 apple.");
    assert.deepEqual(req1, { water_bottle: 2, apple: 1 });

    const req2 = parseMissionRequiredItems("Buy 3 apples and 1 bottle of milk.");
    assert.deepEqual(req2, { apple: 3, milk: 1 });

    const req3 = parseMissionRequiredItems("Buy 1 loaf of bread and 2 bottles of water.");
    assert.deepEqual(req3, { bread: 1, water_bottle: 2 });
  });

  it("validates exact matching inventory as complete with no extra items", () => {
    const required = { water_bottle: 2, apple: 1 };
    const current = { water_bottle: 2, apple: 1 };

    const result = validateMissionInventory(required, current);
    assert.equal(result.isComplete, true);
    assert.equal(result.hasExtraItems, false);
    assert.deepEqual(result.missingItems, {});
    assert.deepEqual(result.excessItems, {});
    assert.match(result.statusMessage, /All required items collected/i);
  });

  it("flags incomplete inventory when items are missing", () => {
    const required = { water_bottle: 2, apple: 1 };
    const current = { water_bottle: 1 }; // missing 1 water and 1 apple

    const result = validateMissionInventory(required, current);
    assert.equal(result.isComplete, false);
    assert.equal(result.missingItems.water_bottle, 1);
    assert.equal(result.missingItems.apple, 1);
    assert.match(result.statusMessage, /Missing items/i);
  });

  it("flags complete inventory with excess required items", () => {
    const required = { water_bottle: 2, apple: 1 };
    const current = { water_bottle: 3, apple: 1 }; // 1 extra water

    const result = validateMissionInventory(required, current);
    assert.equal(result.isComplete, true);
    assert.equal(result.hasExtraItems, true);
    assert.equal(result.excessItems.water_bottle, 1);
    assert.match(result.statusMessage, /extra/i);
  });

  it("flags extra unrequested items (e.g. wrong item like bread picked up)", () => {
    const required = { water_bottle: 2, apple: 1 };
    const current = { water_bottle: 2, apple: 1, bread: 1 };

    const result = validateMissionInventory(required, current);
    assert.equal(result.isComplete, true);
    assert.equal(result.hasExtraItems, true);
    assert.equal(result.excessItems.bread, 1);
    assert.equal(result.excessList.length, 1);
    assert.equal(result.excessList[0].itemId, "bread");
    assert.equal(result.excessList[0].excess, 1);
  });

  it("accepts mission objects directly and handles array inventories", () => {
    const mission = {
      title: "🏪 Shop Mission",
      text: "Buy 2 bottles of water and 1 apple.",
      goal: "Buy exactly 2 bottles of water and 1 apple."
    };
    const currentArray = [
      { itemId: "water_bottle", quantity: 1 },
      { itemId: "water_bottle", quantity: 1 },
      { itemId: "apple", quantity: 1 }
    ];

    const result = validateMissionInventory(mission, currentArray);
    assert.equal(result.isComplete, true);
    assert.equal(result.hasExtraItems, false);
    assert.equal(result.collectedRequirements.length, 2);
    assert.equal(result.collectedRequirements[0].isMet, true);
    assert.equal(result.collectedRequirements[1].isMet, true);
  });

  it("handles combination of missing, extra, and wrong items", () => {
    const mission = { goal: "Buy exactly 2 bottles of water and 1 apple." };
    // Player has 1 water (missing 1), 0 apples (missing 1), and 2 loaves of bread (wrong/extra)
    const current = { water_bottle: 1, bread: 2 };

    const result = validateMissionInventory(mission, current);
    assert.equal(result.isComplete, false);
    assert.equal(result.hasExtraItems, true);
    assert.equal(result.missingList.length, 2);
    assert.equal(result.excessList.length, 1);
    assert.equal(result.excessList[0].itemId, "bread");
    assert.equal(result.excessList[0].excess, 2);
  });

  it("supports passing item objects to addItemToInventory", () => {
    const itemObj = { instanceId: "shop_apple_1", itemId: "apple", displayName: "Red Apple" };
    const inv = addItemToInventory({}, itemObj);
    assert.equal(inv.apple, 1);

    const inv2 = addItemToInventory(inv, itemObj);
    assert.equal(inv2.apple, 2);
  });

  it("validates inventory directly with stable requiredItems and localizes item names", () => {
    const mission = {
      id: "shop_001",
      requiredItems: { water_bottle: 2, apple: 1 }
    };
    const inv = { water_bottle: 2, apple: 1 };

    const resultEn = validateMissionInventory(mission, inv, "en");
    assert.equal(resultEn.isComplete, true);
    assert.equal(resultEn.collectedRequirements[0].displayName, "Water Bottle");

    const resultKo = validateMissionInventory(mission, inv, "ko");
    assert.equal(resultKo.isComplete, true);
    assert.equal(resultKo.collectedRequirements[0].displayName, "생수");
    assert.equal(resultKo.statusMessage, "모든 필요 아이템을 모았습니다!");
  });
});

