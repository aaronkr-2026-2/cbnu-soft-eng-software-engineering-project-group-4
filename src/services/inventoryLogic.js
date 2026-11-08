/**
 * inventoryLogic.js
 * Pure domain logic for item definitions, inventory management,
 * pickup idempotency, and mission requirements validation.
 */

export const ITEM_DEFINITIONS = {
  water_bottle: {
    id: "water_bottle",
    name: "water_bottle",
    displayName: "Water Bottle",
    localizedNames: { en: "Water Bottle", ko: "생수" },
    category: "beverage",
    facility: "Shop",
    icon: "💧"
  },
  apple: {
    id: "apple",
    name: "apple",
    displayName: "Red Apple",
    localizedNames: { en: "Red Apple", ko: "빨간 사과" },
    category: "produce",
    facility: "Shop",
    icon: "🍎"
  },
  bread: {
    id: "bread",
    name: "bread",
    displayName: "Loaf of Bread",
    localizedNames: { en: "Loaf of Bread", ko: "식빵" },
    category: "bakery",
    facility: "Shop",
    icon: "🍞"
  },
  milk: {
    id: "milk",
    name: "milk",
    displayName: "Bottle of Milk",
    localizedNames: { en: "Bottle of Milk", ko: "우유" },
    category: "dairy",
    facility: "Shop",
    icon: "🥛"
  }
};

/**
 * Returns localized display name for an item ID.
 *
 * @param {string} itemId
 * @param {"en"|"ko"} [lang="en"]
 * @returns {string}
 */
export function getLocalizedItemName(itemId, lang = "en") {
  const def = ITEM_DEFINITIONS[itemId];
  if (!def) return itemId;
  const isKo = lang === "ko";
  if (def.localizedNames && def.localizedNames[isKo ? "ko" : "en"]) {
    return def.localizedNames[isKo ? "ko" : "en"];
  }
  return def.displayName || itemId;
}

/**
 * 3D Physical Item placements inside the Shop.
 * Player can approach and pick these up with key E.
 */
export const DEFAULT_SHOP_3D_ITEMS = [
  {
    instanceId: "shop_water_1",
    itemId: "water_bottle",
    position: [-1.8, 0.72, -0.7],
    pickupRadius: 1.25,
    label: "Water Bottle"
  },
  {
    instanceId: "shop_water_2",
    itemId: "water_bottle",
    position: [-1.8, 0.72, -0.2],
    pickupRadius: 1.25,
    label: "Water Bottle"
  },
  {
    instanceId: "shop_water_3",
    itemId: "water_bottle",
    position: [-1.8, 0.72, 0.3],
    pickupRadius: 1.25,
    label: "Water Bottle"
  },
  {
    instanceId: "shop_milk_1",
    itemId: "milk",
    position: [-1.8, 0.72, 0.8],
    pickupRadius: 1.25,
    label: "Bottle of Milk"
  },
  {
    instanceId: "shop_milk_2",
    itemId: "milk",
    position: [-1.8, 0.72, 1.3],
    pickupRadius: 1.25,
    label: "Bottle of Milk"
  },
  {
    instanceId: "shop_apple_1",
    itemId: "apple",
    position: [1.8, 0.72, -0.7],
    pickupRadius: 1.25,
    label: "Red Apple"
  },
  {
    instanceId: "shop_apple_2",
    itemId: "apple",
    position: [1.8, 0.72, -0.2],
    pickupRadius: 1.25,
    label: "Red Apple"
  },
  {
    instanceId: "shop_apple_3",
    itemId: "apple",
    position: [1.8, 0.72, 0.3],
    pickupRadius: 1.25,
    label: "Red Apple"
  },
  {
    instanceId: "shop_bread_1",
    itemId: "bread",
    position: [1.8, 0.72, 0.8],
    pickupRadius: 1.25,
    label: "Loaf of Bread"
  },
  {
    instanceId: "shop_bread_2",
    itemId: "bread",
    position: [1.8, 0.72, 1.3],
    pickupRadius: 1.25,
    label: "Loaf of Bread"
  }
];

/**
 * Adds an item to the player's inventory immutably.
 *
 * @param {Object} inventory - Current inventory map { itemId: count }
 * @param {string|Object} itemIdOrItem - Valid item ID or item object
 * @param {number} [quantity=1] - Quantity to add
 * @returns {Object} Updated inventory map
 */
export function addItemToInventory(inventory = {}, itemIdOrItem, quantity = 1) {
  const itemId =
    typeof itemIdOrItem === "object" && itemIdOrItem !== null
      ? itemIdOrItem.itemId || itemIdOrItem.id
      : itemIdOrItem;
  const qty =
    typeof itemIdOrItem === "object" && itemIdOrItem !== null && typeof itemIdOrItem.quantity === "number"
      ? itemIdOrItem.quantity
      : quantity;

  if (!itemId || typeof itemId !== "string" || qty <= 0) {
    return { ...inventory };
  }

  const currentCount = inventory[itemId] || 0;
  return {
    ...inventory,
    [itemId]: currentCount + qty
  };
}

/**
 * Returns the count of a specific item in inventory.
 *
 * @param {Object} inventory
 * @param {string} itemId
 * @returns {number}
 */
export function getItemCount(inventory = {}, itemId) {
  if (!inventory || !itemId) return 0;
  return typeof inventory[itemId] === "number" ? inventory[itemId] : 0;
}

/**
 * Checks whether a 3D physical item instance was already picked up.
 *
 * @param {string[]|Set<string>} collectedItemIds
 * @param {string} instanceId
 * @returns {boolean}
 */
export function isItemAlreadyCollected(collectedItemIds, instanceId) {
  if (!collectedItemIds || !instanceId) return false;
  if (collectedItemIds instanceof Set) {
    return collectedItemIds.has(instanceId);
  }
  if (Array.isArray(collectedItemIds)) {
    return collectedItemIds.includes(instanceId);
  }
  return false;
}

/**
 * Formats inventory into a human-readable summary string.
 *
 * @param {Object} inventory
 * @param {"en"|"ko"} [language="en"]
 * @returns {string} e.g. "2 Water Bottles, 1 Red Apple" or "생수 2개, 사과 1개"
 */
export function formatInventorySummary(inventory = {}, language = "en") {
  const isKo = language === "ko";
  const parts = [];
  for (const [id, count] of Object.entries(inventory)) {
    if (count > 0) {
      const def = ITEM_DEFINITIONS[id];
      const name = isKo
        ? (def?.localizedNames?.ko || def?.displayName || id)
        : (def?.displayName || id);
      parts.push(isKo ? `${name} ${count}개` : `${count} ${name}${count > 1 ? "s" : ""}`);
    }
  }
  if (parts.length === 0) {
    return isKo ? "비어 있음 (소지품 없음)" : "Empty";
  }
  return parts.join(", ");
}

/**
 * Parses required items from a mission goal or text.
 * e.g. "Buy exactly 2 bottles of water and 1 apple." -> { water_bottle: 2, apple: 1 }
 * e.g. "생수 2병과 사과 1개를 구매하세요." -> { water_bottle: 2, apple: 1 }
 *
 * @param {string} goalText
 * @returns {Object} { [itemId]: requiredQuantity }
 */
export function parseMissionRequiredItems(goalText = "") {
  if (!goalText || typeof goalText !== "string") {
    // Default Shop mission fallback: 2 water bottles and 1 apple
    return { water_bottle: 2, apple: 1 };
  }

  const text = goalText.toLowerCase();
  const required = {};

  // Check water: English or Korean
  const waterMatchEn = text.match(/(\d+)\s*(?:bottles?\s+of\s+)?water/);
  const waterMatchKo = text.match(/생수\s*(\d+)\s*(?:개|병)?/) || text.match(/(\d+)\s*(?:개|병)?\s*(?:의\s*)?생수/);
  if (waterMatchEn) {
    required.water_bottle = parseInt(waterMatchEn[1], 10);
  } else if (waterMatchKo) {
    required.water_bottle = parseInt(waterMatchKo[1], 10);
  }

  // Check apple: English or Korean
  const appleMatchEn = text.match(/(\d+)\s*(?:fresh\s+|red\s+)?apples?/);
  const appleMatchKo = text.match(/사과\s*(\d+)\s*(?:개)?/) || text.match(/(\d+)\s*(?:개)?\s*(?:의\s*)?사과/);
  if (appleMatchEn) {
    required.apple = parseInt(appleMatchEn[1], 10);
  } else if (appleMatchKo) {
    required.apple = parseInt(appleMatchKo[1], 10);
  }

  // Check bread: English or Korean
  const breadMatchEn = text.match(/(\d+)\s*(?:loaves?\s+of\s+|loaf\s+of\s+)?bread/);
  const breadMatchKo = text.match(/(?:식빵|빵)\s*(\d+)\s*(?:개|봉지)?/) || text.match(/(\d+)\s*(?:개|봉지)?\s*(?:의\s*)?(?:식빵|빵)/);
  if (breadMatchEn) {
    required.bread = parseInt(breadMatchEn[1], 10);
  } else if (breadMatchKo) {
    required.bread = parseInt(breadMatchKo[1], 10);
  }

  // Check milk: English or Korean
  const milkMatchEn = text.match(/(\d+)\s*(?:bottles?\s+of\s+|cartons?\s+of\s+)?milk/);
  const milkMatchKo = text.match(/우유\s*(\d+)\s*(?:개|팩|병)?/) || text.match(/(\d+)\s*(?:개|팩|병)?\s*(?:의\s*)?우유/);
  if (milkMatchEn) {
    required.milk = parseInt(milkMatchEn[1], 10);
  } else if (milkMatchKo) {
    required.milk = parseInt(milkMatchKo[1], 10);
  }

  if (Object.keys(required).length === 0) {
    return { water_bottle: 2, apple: 1 };
  }

  return required;
}


/**
 * Validates the player's current inventory against the mission's required items.
 *
 * @param {Object} requiredItems - { water_bottle: 2, apple: 1 }
 * @param {Object|string} requiredItemsOrMission - { water_bottle: 2, apple: 1 } or mission object/string
 * @param {Object|Array} currentInventory - Inventory map or items array
 * @returns {Object} validation result
 */
export function validateMissionInventory(requiredItemsOrMission = {}, currentInventory = {}, interfaceLanguage = "en") {
  // If requiredItemsOrMission has .requiredItems, use that directly!
  let requiredItems = requiredItemsOrMission;
  if (requiredItemsOrMission && typeof requiredItemsOrMission === "object" && requiredItemsOrMission.requiredItems) {
    requiredItems = requiredItemsOrMission.requiredItems;
  } else if (typeof requiredItemsOrMission === "string") {
    requiredItems = parseMissionRequiredItems(requiredItemsOrMission);
  } else if (requiredItemsOrMission && (requiredItemsOrMission.goal || requiredItemsOrMission.text)) {
    const textToParse =
      typeof requiredItemsOrMission.goal === "string"
        ? requiredItemsOrMission.goal
        : (requiredItemsOrMission.goal?.en || requiredItemsOrMission.text?.en || requiredItemsOrMission.text || "");
    requiredItems = parseMissionRequiredItems(textToParse);
  }

  // Normalize current inventory to map if it is an array
  let invMap = currentInventory || {};
  if (Array.isArray(currentInventory)) {
    invMap = {};
    for (const it of currentInventory) {
      const id = it.itemId || it.id;
      if (id) invMap[id] = (invMap[id] || 0) + (it.quantity || 1);
    }
  }

  const missingItems = {};
  const excessItems = {};
  const missingList = [];
  const excessList = [];
  const collectedRequirements = [];
  const progress = {};
  let isComplete = true;
  let hasExtraItems = false;

  // 1. Check all required items
  for (const [itemId, reqQty] of Object.entries(requiredItems)) {
    const curQty = getItemCount(invMap, itemId);
    const displayName = getLocalizedItemName(itemId, interfaceLanguage);
    progress[itemId] = { current: curQty, required: reqQty };

    const isMet = curQty >= reqQty;
    collectedRequirements.push({
      itemId,
      displayName,
      required: reqQty,
      current: curQty,
      isMet
    });

    if (curQty < reqQty) {
      isComplete = false;
      const diff = reqQty - curQty;
      missingItems[itemId] = diff;
      missingList.push({
        itemId,
        displayName,
        required: reqQty,
        current: curQty,
        missing: diff
      });
    } else if (curQty > reqQty) {
      hasExtraItems = true;
      const extra = curQty - reqQty;
      excessItems[itemId] = extra;
      excessList.push({
        itemId,
        displayName,
        required: reqQty,
        current: curQty,
        excess: extra
      });
    }
  }

  // 2. Check for unexpected items in inventory that were not requested
  for (const [itemId, curQty] of Object.entries(invMap)) {
    if (curQty > 0 && !requiredItems[itemId]) {
      hasExtraItems = true;
      const displayName = getLocalizedItemName(itemId, interfaceLanguage);
      excessItems[itemId] = curQty;
      excessList.push({
        itemId,
        displayName,
        required: 0,
        current: curQty,
        excess: curQty
      });
      progress[itemId] = { current: curQty, required: 0 };
    }
  }

  // Formulate user-friendly status message
  let statusMessage = interfaceLanguage === "ko" ? "모든 필요 아이템을 모았습니다!" : "All required items collected!";
  if (!isComplete) {
    const missingDesc = Object.entries(missingItems)
      .map(([id, count]) => {
        const name = getLocalizedItemName(id, interfaceLanguage);
        return `${count} ${name}`;
      })
      .join(", ");
    statusMessage = interfaceLanguage === "ko" ? `부족한 아이템: ${missingDesc}` : `Missing items: ${missingDesc}`;
  } else if (hasExtraItems) {
    const extraDesc = Object.entries(excessItems)
      .map(([id, count]) => {
        const name = getLocalizedItemName(id, interfaceLanguage);
        return `${count} ${name}`;
      })
      .join(", ");
    statusMessage = interfaceLanguage === "ko" ? `필요 아이템 수집 완료 (초과: ${extraDesc})` : `Required items collected, with extra: ${extraDesc}`;
  }

  return {
    isComplete,
    hasExtraItems,
    missingItems,
    excessItems,
    missingList,
    excessList,
    collectedRequirements,
    progress,
    statusMessage
  };
}
