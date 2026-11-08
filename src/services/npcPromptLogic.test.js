import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  NPC_PROFILES,
  buildNPCSystemPrompt,
  formatConversationHistory
} from "./npcPromptLogic.js";

describe("npcPromptLogic - NPC Profiles", () => {
  it("defines distinct profiles for all village facility NPCs", () => {
    assert.equal(NPC_PROFILES["Shop Seller"].name, "Jack");
    assert.equal(NPC_PROFILES["Shop Seller"].facility, "Village Grocery Store");

    assert.equal(NPC_PROFILES["Cafe Barista"].name, "Mia");
    assert.equal(NPC_PROFILES["Cafe Barista"].facility, "Language Cafe");

    assert.equal(NPC_PROFILES["Hotel Receptionist"].name, "Emma");
    assert.equal(NPC_PROFILES["Sarah"].name, "Sarah");
    assert.equal(NPC_PROFILES["Bank Employee"].name, "David");
    assert.equal(NPC_PROFILES["Librarian"].name, "Emily");
    assert.equal(NPC_PROFILES["Officer Alex"].name, "Alex");
    assert.equal(NPC_PROFILES["Teacher Olivia"].name, "Olivia");
    assert.equal(NPC_PROFILES["Tutor Daniel"].name, "Daniel");
    assert.equal(NPC_PROFILES["Staff Mina"].name, "Mina");
    assert.equal(NPC_PROFILES["Career Counselor James"].name, "James");
    assert.equal(NPC_PROFILES["Coordinator Hana"].name, "Hana");
    assert.equal(NPC_PROFILES["Coordinator Yuri"].name, "Yuri");
  });
});

describe("npcPromptLogic - buildNPCSystemPrompt", () => {
  it("injects active mission goal and items into the Shop Seller prompt", () => {
    const activeMission = {
      title: "🏪 Shop Mission",
      text: "Buy 2 bottles of water and 1 apple.",
      goal: "Buy exactly 2 bottles of water and 1 apple."
    };
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission,
      learningPreferences: { level: "beginner", language: "en" }
    });

    assert.match(prompt, /You are Jack, a lively and helpful shopkeeper/);
    assert.match(prompt, /Village Grocery Store/);
    assert.match(prompt, /bottles of water, fresh red apples/);
    assert.match(prompt, /Buy exactly 2 bottles of water and 1 apple/);
    assert.match(prompt, /"🏪 Shop Mission"/);
    assert.match(prompt, /beginner language learners \(A1-A2\)/);
    assert.match(prompt, /NEVER claim or announce that the mission is finished/);
  });

  it("builds a distinct Cafe Barista prompt without shop items", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Cafe Barista",
      activeMission: {
        title: "☕ Cafe Mission",
        goal: "Order exactly 1 hot Americano and 1 croissant."
      },
      learningPreferences: { level: "intermediate", language: "en" }
    });

    assert.match(prompt, /You are Mia, a warm and friendly cafe barista/);
    assert.match(prompt, /Language Cafe/);
    assert.match(prompt, /hot Americano, latte, cappuccino/);
    assert.doesNotMatch(prompt, /Village Grocery Store/);
    assert.match(prompt, /intermediate learners \(B1-B2\)/);
  });

  it("adapts language instructions when Korean is selected", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Teacher Olivia",
      activeMission: null,
      learningPreferences: { level: "beginner", language: "ko" }
    });

    assert.match(prompt, /learning Korean/);
    assert.match(prompt, /reply in natural Korean/);
  });

  it("handles missing active mission gracefully", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Bank Employee",
      activeMission: null,
      learningPreferences: null
    });

    assert.match(prompt, /You are David/);
    assert.match(prompt, /visiting freely without an assigned task/);
    assert.match(prompt, /beginner language learners/);
  });

  it("injects real-time inventory and remaining mission requirements", () => {
    const prompt = buildNPCSystemPrompt({
      npcName: "Shop Seller",
      activeMission: {
        title: "🏪 Shop Mission",
        goal: "Buy exactly 2 bottles of water and 1 apple."
      },
      learningPreferences: { level: "beginner", language: "en" },
      inventory: { water_bottle: 1 } // has 1 water, missing 1 water and 1 apple
    });

    assert.match(prompt, /Player's Current Physical Inventory: 1 Water Bottle/);
    assert.match(prompt, /Items still missing to fulfill mission: 1 Water Bottle, 1 Red Apple/);
  });
});

describe("npcPromptLogic - formatConversationHistory", () => {
  it("returns empty array for invalid input", () => {
    assert.deepEqual(formatConversationHistory(null), []);
    assert.deepEqual(formatConversationHistory(undefined), []);
    assert.deepEqual(formatConversationHistory("not-an-array"), []);
  });

  it("maps roles correctly and trims whitespace", () => {
    const history = [
      { sender: "npc", text: "Hello! Welcome to our village shop." },
      { sender: "user", text: "  Hello, do you have water?  " },
      { sender: "npc", text: "Yes, we have fresh water." }
    ];

    const formatted = formatConversationHistory(history, 10);
    assert.deepEqual(formatted, [
      { role: "assistant", content: "Hello! Welcome to our village shop." },
      { role: "user", content: "Hello, do you have water?" },
      { role: "assistant", content: "Yes, we have fresh water." }
    ]);
  });

  it("bounds history to the specified maximum limit (e.g. 10 messages)", () => {
    const history = [];
    for (let i = 1; i <= 15; i++) {
      history.push({
        sender: i % 2 === 1 ? "user" : "npc",
        text: `Message number ${i}`
      });
    }

    const formatted = formatConversationHistory(history, 10);
    assert.equal(formatted.length, 10);
    // Should take the last 10 messages (from 6 to 15)
    assert.equal(formatted[0].content, "Message number 6");
    assert.equal(formatted[9].content, "Message number 15");
  });

  it("filters out empty or whitespace-only messages", () => {
    const history = [
      { sender: "user", text: "Valid message" },
      { sender: "npc", text: "   " },
      { sender: "user", text: "" },
      null,
      { sender: "npc", text: "Another valid message" }
    ];

    const formatted = formatConversationHistory(history, 10);
    assert.equal(formatted.length, 2);
    assert.equal(formatted[0].content, "Valid message");
    assert.equal(formatted[1].content, "Another valid message");
  });
});
